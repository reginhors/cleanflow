import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { fetchTodayTasks } from '../api/mock';
import { db, type CachedTask } from '../db/outbox';

export default function DayPlan() {
  const { t } = useI18n();
  const { session, setSession } = useAuth();
  const nav = useNavigate();
  const [tasks, setTasks] = useState<CachedTask[]>([]);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      // Offline-first: lees eerst lokaal, ververs daarna als we online zijn
      const cached = await db.tasks.orderBy('sequence').toArray();
      if (cached.length) setTasks(cached);
      if (navigator.onLine) {
        try {
          const fresh = await fetchTodayTasks(session.userId);
          // Merge: behoud lokale status (in_progress, paused, etc.)
          const byId = new Map(cached.map((c) => [c.id, c]));
          const merged = fresh.map((f) => {
            const local = byId.get(f.id);
            return local ? { ...f, ...local } : f;
          });
          await db.tasks.bulkPut(merged);
          setTasks(merged);
        } catch {
          /* offline of error: stille fallback op cache */
        }
      }
    })();
  }, [session]);

  const total = tasks.length;
  const done = tasks.filter((x) => x.status === 'done' || x.status === 'skipped').length;

  return (
    <main className="min-h-screen pb-32">
      <header className="bg-gom-green text-white px-4 pt-12 pb-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">{t('plan.title')}</h1>
          <span className="text-sm opacity-90">{done}/{total}</span>
        </div>
        <p className="text-sm opacity-90 mt-1">{session?.displayName}</p>
        {!online && (
          <p className="mt-3 inline-block bg-amber-200 text-amber-900 text-xs px-2 py-1 rounded-full">
            {t('common.offline')}
          </p>
        )}
      </header>

      <ul className="px-4 mt-4 space-y-3">
        {tasks.length === 0 && (
          <li className="text-slate-500 text-center py-12">{t('plan.empty')}</li>
        )}
        {tasks.map((task) => (
          <li key={task.id}>
            <Link
              to={`/room/${task.id}`}
              className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <DemandPill band={task.demandBand} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{task.roomName}</p>
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {t('plan.minutes')}: {task.expectedMinutes} · {task.wingCode}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 grid grid-cols-3">
        <Link to="/assistant" className="py-3 text-center text-sm font-medium text-gom-green">
          {t('plan.assistant')}
        </Link>
        <Link to="/measure" className="py-3 text-center text-sm font-medium text-slate-700">
          {t('plan.whatWeMeasure')}
        </Link>
        <button
          onClick={() => {
            setSession(null);
            nav('/login', { replace: true });
          }}
          className="py-3 text-center text-sm font-medium text-slate-500"
        >
          {t('plan.logout')}
        </button>
      </nav>
    </main>
  );
}

function DemandPill({ band }: { band: CachedTask['demandBand'] }) {
  const map = {
    low:    { bg: 'bg-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    medium: { bg: 'bg-amber-100',   dot: 'bg-amber-500',   text: 'text-amber-700'   },
    high:   { bg: 'bg-rose-100',    dot: 'bg-rose-500',    text: 'text-rose-700'    }
  } as const;
  const c = map[band];
  return (
    <div className={`w-12 h-12 ${c.bg} rounded-full flex items-center justify-center shrink-0`} aria-hidden>
      <span className={`w-3 h-3 rounded-full ${c.dot}`} />
      <span className={`sr-only ${c.text}`}>{band}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: CachedTask['status'] }) {
  const { t } = useI18n();
  const map: Record<CachedTask['status'], string> = {
    pending: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    paused: 'bg-amber-100 text-amber-700',
    done: 'bg-emerald-100 text-emerald-700',
    skipped: 'bg-slate-100 text-slate-500'
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${map[status]}`}>
      {t(`plan.status.${status}` as any)}
    </span>
  );
}

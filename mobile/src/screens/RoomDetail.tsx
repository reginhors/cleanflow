import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { db, enqueue, type CachedTask } from '../db/outbox';

type Phase = 'idle' | 'running' | 'paused' | 'finishing';

export default function RoomDetail() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { taskId = '' } = useParams();
  const [task, setTask] = useState<CachedTask | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [elapsed, setElapsed] = useState(0); // ms
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    db.tasks.get(taskId).then((row) => {
      if (!row) return;
      setTask(row);
      setElapsed(row.elapsedMs ?? 0);
      if (row.status === 'in_progress') setPhase('running');
      else if (row.status === 'paused') setPhase('paused');
      else if (row.status === 'done') setPhase('finishing');
    });
  }, [taskId]);

  // Timer
  useEffect(() => {
    if (phase !== 'running') return;
    const startedAt = Date.now() - elapsed;
    tickRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 500);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!task) {
    return <main className="p-6">…</main>;
  }

  const persist = async (patch: Partial<CachedTask>) => {
    const next = { ...task, ...patch, elapsedMs: elapsed };
    await db.tasks.put(next);
    setTask(next);
  };

  const onStart = async () => {
    setPhase('running');
    await persist({ status: 'in_progress', startedAt: Date.now() });
    await enqueue({ kind: 'task.start', taskId, payload: { at: Date.now() } });
  };
  const onPause = async () => {
    setPhase('paused');
    await persist({ status: 'paused' });
    await enqueue({ kind: 'task.pause', taskId, payload: { at: Date.now(), elapsedMs: elapsed } });
  };
  const onResume = async () => {
    setPhase('running');
    await persist({ status: 'in_progress' });
    await enqueue({ kind: 'task.resume', taskId, payload: { at: Date.now() } });
  };
  const onStop = () => setPhase('finishing');

  return (
    <main className="min-h-screen pb-12">
      <header className="bg-gom-green text-white px-4 pt-12 pb-6">
        <Link to="/" className="text-sm opacity-90">← {t('common.back')}</Link>
        <h1 className="text-2xl font-bold mt-2">{task.roomName}</h1>
        <p className="text-sm opacity-90 mt-1">
          {t('room.expectedTime')}: {task.expectedMinutes} {t('plan.minutes')} · {t('room.demand')}: {t(`plan.demand.${task.demandBand}` as any)}
        </p>
      </header>

      {phase !== 'finishing' ? (
        <section className="p-6 flex flex-col items-center">
          <p className="text-slate-500 mb-2">{t('room.timer')}</p>
          <div className="text-7xl font-mono font-bold tabular-nums tracking-tight">
            {formatTime(elapsed)}
          </div>

          <div className="mt-12 w-full max-w-sm space-y-3">
            {phase === 'idle' && (
              <button
                onClick={onStart}
                className="w-full bg-gom-green hover:bg-gom-green-dark text-white text-3xl font-bold rounded-2xl py-10 shadow-lg"
              >
                {t('room.start')}
              </button>
            )}
            {phase === 'running' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onPause}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xl font-semibold rounded-xl py-6"
                >
                  {t('room.pause')}
                </button>
                <button
                  onClick={onStop}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xl font-semibold rounded-xl py-6"
                >
                  {t('room.stop')}
                </button>
              </div>
            )}
            {phase === 'paused' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onResume}
                  className="bg-gom-green hover:bg-gom-green-dark text-white text-xl font-semibold rounded-xl py-6"
                >
                  {t('room.resume')}
                </button>
                <button
                  onClick={onStop}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xl font-semibold rounded-xl py-6"
                >
                  {t('room.stop')}
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <FinishForm
          task={task}
          elapsed={elapsed}
          onCancel={() => setPhase(task.status === 'paused' ? 'paused' : 'running')}
          onDone={async (data) => {
            await persist({ status: 'done', preSatisfaction: data.preSatisfaction, note: data.note });
            await enqueue({
              kind: 'task.complete',
              taskId,
              payload: { ...data, elapsedMs: elapsed, at: Date.now() }
            });
            nav('/');
          }}
        />
      )}
    </main>
  );
}

function FinishForm({
  task,
  elapsed,
  onDone,
  onCancel
}: {
  task: CachedTask;
  elapsed: number;
  onCancel: () => void;
  onDone: (d: { preSatisfaction: number; note: string; photoDataUrl?: string }) => void;
}) {
  const { t } = useI18n();
  const [score, setScore] = useState<number>(task.preSatisfaction ?? 0);
  const [note, setNote] = useState<string>(task.note ?? '');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const minutes = useMemo(() => Math.round(elapsed / 60000), [elapsed]);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section className="p-6 space-y-6">
      <p className="text-sm text-slate-500">⏱️ {minutes} {t('plan.minutes')}</p>

      <div>
        <p className="font-medium mb-2">{t('room.preSatisfaction')}</p>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={`flex-1 text-2xl rounded-xl py-4 border ${
                score === n ? 'bg-gom-green border-gom-green text-white' : 'bg-white border-slate-300'
              }`}
              aria-label={`${n}`}
            >
              {['😖','😕','😐','🙂','😀'][n - 1]}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="font-medium">{t('room.note')}</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder={t('room.notePlaceholder')}
          className="mt-1 w-full rounded-lg border border-slate-300 p-3 bg-white"
        />
      </label>

      <label className="block">
        <span className="font-medium">{t('room.photo')}</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPhoto}
          className="mt-1 block w-full text-sm"
        />
        {photo && <img src={photo} alt="" className="mt-2 max-h-48 rounded-lg" />}
      </label>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button onClick={onCancel} className="rounded-xl border border-slate-300 py-4 font-medium">
          {t('common.cancel')}
        </button>
        <button
          onClick={() => onDone({ preSatisfaction: score || 3, note, photoDataUrl: photo })}
          className="rounded-xl bg-gom-green hover:bg-gom-green-dark text-white py-4 font-semibold"
        >
          {t('room.confirm')}
        </button>
      </div>
    </section>
  );
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

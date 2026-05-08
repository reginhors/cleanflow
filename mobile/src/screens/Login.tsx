import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { pinLogin } from '../api/mock';

export default function Login() {
  const { t } = useI18n();
  const { setSession } = useAuth();
  const nav = useNavigate();
  const [employeeCode, setEmployeeCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    setBusy(true);
    setError(null);
    try {
      const s = await pinLogin(employeeCode, pin);
      setSession(s);
      nav('/', { replace: true });
    } catch {
      setError(t('login.error'));
      setPin('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-white to-slate-100">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gom-green text-center mb-1">{t('app.title')}</h1>
        <p className="text-center text-slate-600 mb-8">{t('login.subtitle')}</p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">{t('login.employeeCode')}</span>
            <input
              inputMode="numeric"
              autoComplete="username"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full text-2xl tracking-widest text-center rounded-lg border border-slate-300 p-3 bg-white"
              placeholder="••••"
              maxLength={6}
            />
          </label>

          <PinPad value={pin} onChange={setPin} />

          {error && <p className="text-red-600 text-center text-sm" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={busy || pin.length !== 6 || employeeCode.length === 0}
            className="w-full bg-gom-green hover:bg-gom-green-dark disabled:bg-slate-300 text-white font-semibold rounded-xl text-lg py-4"
          >
            {t('login.submit')}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-8">
          Pilot: HR Kralingse Zoom · v0.1
        </p>
      </div>
    </main>
  );
}

function PinPad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const press = (d: string) => {
    if (d === '⌫') onChange(value.slice(0, -1));
    else if (value.length < 6) onChange(value + d);
  };
  const dots = Array.from({ length: 6 }, (_, i) => i < value.length);

  return (
    <div>
      <div className="flex justify-center gap-3 my-4" aria-label="PIN">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${filled ? 'bg-gom-green border-gom-green' : 'border-slate-400'}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) =>
          d === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(d)}
              className="bg-white border border-slate-300 rounded-xl text-2xl font-semibold py-4 active:bg-slate-100"
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  );
}

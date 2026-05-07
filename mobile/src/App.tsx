import { Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n';
import { AuthProvider, useAuth } from './auth';
import Login from './screens/Login';
import DayPlan from './screens/DayPlan';
import RoomDetail from './screens/RoomDetail';
import WhatWeMeasure from './screens/WhatWeMeasure';
import MyDay from './screens/MyDay';
import Assistant from './screens/Assistant';

function Protected({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Shell() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><DayPlan /></Protected>} />
      <Route path="/room/:taskId" element={<Protected><RoomDetail /></Protected>} />
      <Route path="/measure" element={<Protected><WhatWeMeasure /></Protected>} />
      <Route path="/assistant" element={<Protected><Assistant /></Protected>} />
      <Route path="/myday" element={<Protected><MyDay /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <LangBar />
        <Shell />
      </AuthProvider>
    </I18nProvider>
  );
}

function LangBar() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="fixed top-2 right-2 z-50 flex gap-1 bg-white/90 rounded-full shadow px-1 py-0.5 text-xs">
      <button
        onClick={() => setLocale('nl')}
        className={`px-2 py-1 rounded-full ${locale === 'nl' ? 'bg-gom-green text-white' : ''}`}
        style={{ minHeight: 32 }}
      >
        NL
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded-full ${locale === 'en' ? 'bg-gom-green text-white' : ''}`}
        style={{ minHeight: 32 }}
      >
        EN
      </button>
    </div>
  );
}

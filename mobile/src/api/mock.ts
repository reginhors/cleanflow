// Mock-API zodat de mobiele app draait zonder backend.
// Zelfde shape als wat /backend straks teruggeeft — vervangen we 1-op-1.

import type { CachedTask } from '../db/outbox';

const MOCK_USERS = [
  { id: 'u-fatima', employeeCode: '1001', pin: '123456', displayName: 'Fatima' },
  { id: 'u-piotr',  employeeCode: '1002', pin: '654321', displayName: 'Piotr' },
  { id: 'u-anouk',  employeeCode: '1003', pin: '111111', displayName: 'Anouk' }
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function pinLogin(employeeCode: string, pin: string) {
  await wait(250);
  const u = MOCK_USERS.find((x) => x.employeeCode === employeeCode && x.pin === pin);
  if (!u) throw new Error('invalid_credentials');
  return {
    userId: u.id,
    displayName: u.displayName,
    employeeCode: u.employeeCode,
    token: 'mock-jwt-' + u.id,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000
  };
}

export async function fetchTodayTasks(userId: string): Promise<CachedTask[]> {
  await wait(150);
  // Geseed: 6 ruimtes, route-volgorde aangenomen (later door optimizer gezet).
  const base: CachedTask[] = [
    { id: 't1', shiftId: 's1', roomId: 'r-A104', roomName: 'A.1.04 — Kantoor',   wingCode: 'A', sequence: 1, expectedMinutes: 8,  demandBand: 'high',   status: 'pending', elapsedMs: 0 },
    { id: 't2', shiftId: 's1', roomId: 'r-A105', roomName: 'A.1.05 — Toiletten', wingCode: 'A', sequence: 2, expectedMinutes: 12, demandBand: 'high',   status: 'pending', elapsedMs: 0 },
    { id: 't3', shiftId: 's1', roomId: 'r-B201', roomName: 'B.2.01 — Lokaal',    wingCode: 'B', sequence: 3, expectedMinutes: 15, demandBand: 'medium', status: 'pending', elapsedMs: 0 },
    { id: 't4', shiftId: 's1', roomId: 'r-B202', roomName: 'B.2.02 — Lokaal',    wingCode: 'B', sequence: 4, expectedMinutes: 15, demandBand: 'medium', status: 'pending', elapsedMs: 0 },
    { id: 't5', shiftId: 's1', roomId: 'r-C101', roomName: 'C.1.01 — Gang',      wingCode: 'C', sequence: 5, expectedMinutes: 6,  demandBand: 'low',    status: 'pending', elapsedMs: 0 },
    { id: 't6', shiftId: 's1', roomId: 'r-D110', roomName: 'D.1.10 — Pantry',    wingCode: 'D', sequence: 6, expectedMinutes: 10, demandBand: 'medium', status: 'pending', elapsedMs: 0 }
  ];
  void userId;
  return base;
}

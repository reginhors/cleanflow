// Offline-first outbox: alles wat de cleaner doet (start/pauze/stop/note/photo)
// wordt eerst lokaal weggeschreven en later naar de backend gepushed.
// Server-wint op tijdsegmenten, client-wint op vrije tekst/foto's
// (zie docs/architecture.md).

import Dexie, { Table } from 'dexie';

export type OutboxKind =
  | 'task.start'
  | 'task.pause'
  | 'task.resume'
  | 'task.complete'
  | 'task.skip'
  | 'issue.create';

export interface OutboxEntry {
  id?: number;
  kind: OutboxKind;
  taskId: string;
  payload: Record<string, unknown>;
  createdAt: number;
  syncedAt?: number;
}

export interface CachedTask {
  id: string;
  shiftId: string;
  roomId: string;
  roomName: string;
  wingCode: string;
  sequence: number;
  expectedMinutes: number;
  demandBand: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'paused' | 'done' | 'skipped';
  startedAt?: number;
  elapsedMs: number;
  preSatisfaction?: number;
  note?: string;
}

class GomDb extends Dexie {
  outbox!: Table<OutboxEntry, number>;
  tasks!: Table<CachedTask, string>;

  constructor() {
    super('gom-cleaning');
    this.version(1).stores({
      outbox: '++id, kind, taskId, syncedAt',
      tasks: 'id, status, sequence'
    });
  }
}

export const db = new GomDb();

export async function enqueue(entry: Omit<OutboxEntry, 'id' | 'createdAt'>) {
  await db.outbox.add({ ...entry, createdAt: Date.now() });
}

export async function pendingCount() {
  return db.outbox.where('syncedAt').equals(0).or('syncedAt').equals(undefined as any).count();
}

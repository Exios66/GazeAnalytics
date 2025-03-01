import { gazeData, sessions, type GazeData, type InsertGazeData, type Session, type InsertSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  updateSession(sessionId: string, endTime: Date): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  addGazeData(data: InsertGazeData): Promise<GazeData>;
  getGazeData(sessionId: string): Promise<GazeData[]>;
}

export class DatabaseStorage implements IStorage {
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateSession(sessionId: string, endTime: Date): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set({ endTime })
      .where(eq(sessions.sessionId, sessionId))
      .returning();

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId));
    return session;
  }

  async addGazeData(data: InsertGazeData): Promise<GazeData> {
    const [gazeDataEntry] = await db
      .insert(gazeData)
      .values(data)
      .returning();
    return gazeDataEntry;
  }

  async getGazeData(sessionId: string): Promise<GazeData[]> {
    return db
      .select()
      .from(gazeData)
      .where(eq(gazeData.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
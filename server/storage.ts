import { GazeData, InsertGazeData, Session, InsertSession } from "@shared/schema";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  updateSession(sessionId: string, endTime: Date): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  addGazeData(data: InsertGazeData): Promise<GazeData>;
  getGazeData(sessionId: string): Promise<GazeData[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private gazeData: Map<number, GazeData>;
  private currentGazeId: number;

  constructor() {
    this.sessions = new Map();
    this.gazeData = new Map();
    this.currentGazeId = 1;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const session: Session = {
      id: this.sessions.size + 1,
      sessionId: insertSession.sessionId,
      calibrationData: insertSession.calibrationData,
      startTime: new Date(),
      endTime: null,
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }

  async updateSession(sessionId: string, endTime: Date): Promise<Session> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");
    
    const updatedSession = { ...session, endTime };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async addGazeData(data: InsertGazeData): Promise<GazeData> {
    const gazeData: GazeData = {
      id: this.currentGazeId++,
      timestamp: new Date(),
      ...data,
    };
    this.gazeData.set(gazeData.id, gazeData);
    return gazeData;
  }

  async getGazeData(sessionId: string): Promise<GazeData[]> {
    return Array.from(this.gazeData.values()).filter(
      (data) => data.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGazeDataSchema, insertSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/sessions", async (req, res) => {
    try {
      const session = insertSessionSchema.parse(req.body);
      const result = await storage.createSession(session);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.patch("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const result = await storage.updateSession(sessionId, new Date());
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: "Session not found" });
    }
  });

  app.get("/api/sessions/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const session = await storage.getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.json(session);
  });

  app.post("/api/gaze", async (req, res) => {
    try {
      const gazeData = insertGazeDataSchema.parse(req.body);
      const result = await storage.addGazeData(gazeData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid gaze data" });
    }
  });

  app.get("/api/gaze/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const gazeData = await storage.getGazeData(sessionId);
    res.json(gazeData);
  });

  const httpServer = createServer(app);
  return httpServer;
}

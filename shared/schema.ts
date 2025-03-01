import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gazeData = pgTable("gaze_data", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  screenWidth: integer("screen_width").notNull(),
  screenHeight: integer("screen_height").notNull(),
  accuracy: integer("accuracy"),
});

export const insertGazeDataSchema = createInsertSchema(gazeData).omit({
  id: true,
  timestamp: true
});

export type InsertGazeData = z.infer<typeof insertGazeDataSchema>;
export type GazeData = typeof gazeData.$inferSelect;

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  calibrationData: jsonb("calibration_data"),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  startTime: true,
  endTime: true
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

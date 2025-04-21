import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { readFileSync } from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock data endpoints for the GenAI Micro-Learning App
  app.get("/api/sections", (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.sections);
  });

  app.get("/api/audibles", (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.audibles);
  });

  app.get("/api/flashcards", (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.flashcards);
  });

  app.get("/api/trivia-categories", (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.triviaCategories);
  });

  app.get("/api/trivia-questions", (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.triviaQuestions);
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

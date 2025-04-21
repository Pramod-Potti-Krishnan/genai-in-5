import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { readFileSync } from "fs";
import path from "path";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Protected route middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Mock data endpoints for the GenAI Micro-Learning App
  app.get("/api/sections", isAuthenticated, (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.sections);
  });

  app.get("/api/audibles", isAuthenticated, (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.audibles);
  });

  app.get("/api/flashcards", isAuthenticated, (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.flashcards);
  });

  app.get("/api/trivia-categories", isAuthenticated, (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.triviaCategories);
  });

  app.get("/api/trivia-questions", isAuthenticated, (req, res) => {
    const data = JSON.parse(readFileSync(path.join(__dirname, "..", "client", "src", "lib", "mockData.ts"), "utf8"));
    res.json(data.triviaQuestions);
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

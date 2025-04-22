import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { 
  insertTopicSchema, 
  insertAudibleSchema, 
  insertFlashcardSchema, 
  insertQuizQuestionSchema,
  insertUserProgressSchema,
  insertUserQuizScoreSchema
} from "@shared/schema";
import { ZodError } from "zod";

// Create storage directories if they don't exist
const createStorageFolders = async () => {
  const dirs = ['./uploads', './uploads/audios', './uploads/images'];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      await promisify(fs.mkdir)(dir, { recursive: true });
    }
  }
};

// Configure multer for handling file uploads
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.startsWith('audio/') ? 'audios' : 'images';
    cb(null, `./uploads/${fileType}`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_config,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    
    if (
      (file.fieldname === 'audio' && allowedAudioTypes.includes(file.mimetype)) ||
      (file.fieldname === 'image' && allowedImageTypes.includes(file.mimetype))
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return new Error('Invalid file type');
    }
  }
});

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({ 
      error: 'Validation error',
      details: err.errors 
    });
  }
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: 'File upload error',
      message: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Server error',
    message: err.message 
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create storage folders
  await createStorageFolders();
  
  // Setup authentication
  setupAuth(app);
  
  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // ===== Public API Routes =====
  
  // Topics endpoints
  app.get("/api/topics", async (req, res, next) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/topics/:id", async (req, res, next) => {
    try {
      const topic = await storage.getTopic(parseInt(req.params.id));
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      next(error);
    }
  });
  
  // Audibles endpoints
  app.get("/api/topics/:id/audibles", async (req, res, next) => {
    try {
      const topicId = parseInt(req.params.id);
      const audibles = await storage.getAudibles(topicId);
      res.json(audibles);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/audibles", async (req, res, next) => {
    try {
      const audibles = await storage.getAudibles();
      res.json(audibles);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/audibles/:id", async (req, res, next) => {
    try {
      const audible = await storage.getAudible(parseInt(req.params.id));
      if (!audible) {
        return res.status(404).json({ error: "Audible not found" });
      }
      res.json(audible);
    } catch (error) {
      next(error);
    }
  });
  
  // Flashcards endpoints
  app.get("/api/topics/:id/flashcards", async (req, res, next) => {
    try {
      const topicId = parseInt(req.params.id);
      const flashcards = await storage.getFlashcards(topicId);
      res.json(flashcards);
    } catch (error) {
      next(error);
    }
  });
  
  // Quiz Questions endpoints
  app.get("/api/topics/:id/questions", async (req, res, next) => {
    try {
      const topicId = parseInt(req.params.id);
      const questions = await storage.getQuizQuestions(topicId);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  });
  
  // Leaderboard endpoint
  app.get("/api/leaderboard", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  });
  
  // ===== Protected API Routes (requires authentication) =====
  
  // User progress endpoint
  app.post("/api/progress", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertUserProgressSchema.parse({
        userId: req.user!.id,
        ...req.body
      });
      
      const progress = await storage.createOrUpdateProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      next(error);
    }
  });
  
  // User flashcard review endpoint
  app.post("/api/flashcards/:id/review", isAuthenticated, async (req, res, next) => {
    try {
      const cardId = parseInt(req.params.id);
      const userReview = await storage.reviewFlashcard(req.user!.id, cardId);
      res.status(201).json(userReview);
    } catch (error) {
      next(error);
    }
  });
  
  // Quiz submission endpoint
  app.post("/api/quiz/submit", isAuthenticated, async (req, res, next) => {
    try {
      const validatedData = insertUserQuizScoreSchema.parse({
        userId: req.user!.id,
        ...req.body
      });
      
      const quizScore = await storage.saveQuizScore(validatedData);
      
      // Return correct answers if the quiz is complete
      let correctAnswers = null;
      if (req.body.topicId) {
        const questions = await storage.getQuizQuestions(req.body.topicId);
        correctAnswers = questions.map(q => ({
          id: q.id,
          correctIndex: q.correctIndex
        }));
      }
      
      res.status(201).json({
        score: quizScore,
        correctAnswers
      });
    } catch (error) {
      next(error);
    }
  });
  
  // User stats endpoint
  app.get("/api/me/stats", isAuthenticated, async (req, res, next) => {
    try {
      const stats = await storage.getUserStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });
  
  // User progress sync endpoint
  app.get("/api/me/progress", isAuthenticated, async (req, res, next) => {
    try {
      const progress = await storage.getUserProgress(req.user!.id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  });
  
  // User flashcards sync endpoint
  app.get("/api/me/flashcards", isAuthenticated, async (req, res, next) => {
    try {
      const flashcards = await storage.getUserFlashcards(req.user!.id);
      res.json(flashcards);
    } catch (error) {
      next(error);
    }
  });
  
  // User quiz scores sync endpoint
  app.get("/api/me/quiz-scores", isAuthenticated, async (req, res, next) => {
    try {
      const quizScores = await storage.getUserQuizScores(req.user!.id);
      res.json(quizScores);
    } catch (error) {
      next(error);
    }
  });
  
  // Onboarding status endpoints
  app.get("/api/me/onboarding", isAuthenticated, async (req, res, next) => {
    try {
      // Return the current user data including onboarding status
      res.json({
        onboarded: req.user!.onboarded,
        lastSeenVersion: req.user!.lastSeenVersion
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/me/onboarding", isAuthenticated, async (req, res, next) => {
    try {
      const { onboarded } = req.body;
      
      if (typeof onboarded !== 'boolean') {
        return res.status(400).json({ error: "onboarded field must be a boolean" });
      }
      
      const updatedUser = await storage.updateOnboardingStatus(req.user!.id, onboarded);
      
      res.json({
        onboarded: updatedUser!.onboarded,
        lastSeenVersion: updatedUser!.lastSeenVersion
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/me/version", isAuthenticated, async (req, res, next) => {
    try {
      const { version } = req.body;
      
      if (typeof version !== 'string' || !version) {
        return res.status(400).json({ error: "version field must be a non-empty string" });
      }
      
      const updatedUser = await storage.updateLastSeenVersion(req.user!.id, version);
      
      res.json({
        onboarded: updatedUser!.onboarded,
        lastSeenVersion: updatedUser!.lastSeenVersion
      });
    } catch (error) {
      next(error);
    }
  });
  
  // ===== Admin API Routes (requires admin role) =====
  
  // Topic management endpoints
  app.post("/api/admin/topics", isAdmin, async (req, res, next) => {
    try {
      const validatedData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(validatedData);
      res.status(201).json(topic);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/admin/topics/:id", isAdmin, async (req, res, next) => {
    try {
      const topicId = parseInt(req.params.id);
      const validatedData = insertTopicSchema.partial().parse(req.body);
      const topic = await storage.updateTopic(topicId, validatedData);
      
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      
      res.json(topic);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete("/api/admin/topics/:id", isAdmin, async (req, res, next) => {
    try {
      const topicId = parseInt(req.params.id);
      const success = await storage.deleteTopic(topicId);
      
      if (!success) {
        return res.status(404).json({ error: "Topic not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Audible management endpoints
  app.post("/api/admin/audibles", isAdmin, upload.single('audio'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Audio file is required" });
      }
      
      // Store file information
      const audioUrl = `/uploads/audios/${req.file.filename}`;
      
      // Store in database
      const validatedData = insertAudibleSchema.parse({
        ...req.body,
        audioUrl,
        topicId: parseInt(req.body.topicId),
        lengthSec: parseInt(req.body.lengthSec)
      });
      
      const audible = await storage.createAudible(validatedData);
      
      // Create storage object record
      await storage.createStorageObject({
        bucket: 'audios',
        path: req.file.filename,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user!.id,
        publicUrl: audioUrl
      });
      
      res.status(201).json(audible);
    } catch (error) {
      // Delete uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
  
  app.put("/api/admin/audibles/:id", isAdmin, upload.single('audio'), async (req, res, next) => {
    try {
      const audibleId = parseInt(req.params.id);
      
      // Prepare update data
      let updateData: any = {
        ...req.body
      };
      
      // Handle numeric fields
      if (req.body.topicId) {
        updateData.topicId = parseInt(req.body.topicId);
      }
      
      if (req.body.lengthSec) {
        updateData.lengthSec = parseInt(req.body.lengthSec);
      }
      
      // Handle file upload
      if (req.file) {
        // Get current audible to find old file
        const currentAudible = await storage.getAudible(audibleId);
        if (currentAudible) {
          // Try to delete old file
          try {
            const oldFilePath = path.join(process.cwd(), currentAudible.audioUrl);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (err) {
            console.error('Failed to delete old file:', err);
          }
        }
        
        // Update with new file
        const audioUrl = `/uploads/audios/${req.file.filename}`;
        updateData.audioUrl = audioUrl;
        
        // Create storage object record
        await storage.createStorageObject({
          bucket: 'audios',
          path: req.file.filename,
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          size: req.file.size,
          uploadedBy: req.user!.id,
          publicUrl: audioUrl
        });
      }
      
      // Validate and update
      const validatedData = insertAudibleSchema.partial().parse(updateData);
      const audible = await storage.updateAudible(audibleId, validatedData);
      
      if (!audible) {
        return res.status(404).json({ error: "Audible not found" });
      }
      
      res.json(audible);
    } catch (error) {
      // Delete uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
  
  app.delete("/api/admin/audibles/:id", isAdmin, async (req, res, next) => {
    try {
      const audibleId = parseInt(req.params.id);
      
      // Get audible to find file
      const audible = await storage.getAudible(audibleId);
      if (audible) {
        // Try to delete file
        try {
          const filePath = path.join(process.cwd(), audible.audioUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error('Failed to delete file:', err);
        }
      }
      
      const success = await storage.deleteAudible(audibleId);
      
      if (!success) {
        return res.status(404).json({ error: "Audible not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Flashcard management endpoints
  app.post("/api/admin/flashcards", isAdmin, upload.single('image'), async (req, res, next) => {
    try {
      // Prepare data
      let flashcardData: any = {
        ...req.body,
        topicId: parseInt(req.body.topicId)
      };
      
      // Process bullets array if provided as a string
      if (typeof req.body.bullets === 'string') {
        try {
          flashcardData.bullets = JSON.parse(req.body.bullets);
        } catch (e) {
          flashcardData.bullets = req.body.bullets.split(',').map((item: string) => item.trim());
        }
      }
      
      // Handle image upload
      if (req.file) {
        const imageUrl = `/uploads/images/${req.file.filename}`;
        flashcardData.imageUrl = imageUrl;
        
        // Create storage object record
        await storage.createStorageObject({
          bucket: 'images',
          path: req.file.filename,
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          size: req.file.size,
          uploadedBy: req.user!.id,
          publicUrl: imageUrl
        });
      }
      
      // Validate and create
      const validatedData = insertFlashcardSchema.parse(flashcardData);
      const flashcard = await storage.createFlashcard(validatedData);
      
      res.status(201).json(flashcard);
    } catch (error) {
      // Delete uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
  
  app.put("/api/admin/flashcards/:id", isAdmin, upload.single('image'), async (req, res, next) => {
    try {
      const flashcardId = parseInt(req.params.id);
      
      // Prepare update data
      let updateData: any = {
        ...req.body
      };
      
      // Handle numeric fields
      if (req.body.topicId) {
        updateData.topicId = parseInt(req.body.topicId);
      }
      
      // Process bullets array if provided as a string
      if (typeof req.body.bullets === 'string') {
        try {
          updateData.bullets = JSON.parse(req.body.bullets);
        } catch (e) {
          updateData.bullets = req.body.bullets.split(',').map((item: string) => item.trim());
        }
      }
      
      // Handle image upload
      if (req.file) {
        // Get current flashcard to find old file
        const currentFlashcard = await storage.getFlashcard(flashcardId);
        if (currentFlashcard?.imageUrl) {
          // Try to delete old file
          try {
            const oldFilePath = path.join(process.cwd(), currentFlashcard.imageUrl);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (err) {
            console.error('Failed to delete old image:', err);
          }
        }
        
        // Update with new file
        const imageUrl = `/uploads/images/${req.file.filename}`;
        updateData.imageUrl = imageUrl;
        
        // Create storage object record
        await storage.createStorageObject({
          bucket: 'images',
          path: req.file.filename,
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          size: req.file.size,
          uploadedBy: req.user!.id,
          publicUrl: imageUrl
        });
      }
      
      // Validate and update
      const validatedData = insertFlashcardSchema.partial().parse(updateData);
      const flashcard = await storage.updateFlashcard(flashcardId, validatedData);
      
      if (!flashcard) {
        return res.status(404).json({ error: "Flashcard not found" });
      }
      
      res.json(flashcard);
    } catch (error) {
      // Delete uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
  
  app.delete("/api/admin/flashcards/:id", isAdmin, async (req, res, next) => {
    try {
      const flashcardId = parseInt(req.params.id);
      
      // Get flashcard to find image file
      const flashcard = await storage.getFlashcard(flashcardId);
      if (flashcard?.imageUrl) {
        // Try to delete file
        try {
          const filePath = path.join(process.cwd(), flashcard.imageUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error('Failed to delete image file:', err);
        }
      }
      
      const success = await storage.deleteFlashcard(flashcardId);
      
      if (!success) {
        return res.status(404).json({ error: "Flashcard not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Quiz question management endpoints
  app.post("/api/admin/questions", isAdmin, async (req, res, next) => {
    try {
      // Prepare data
      let questionData: any = {
        ...req.body,
        topicId: parseInt(req.body.topicId),
        correctIndex: parseInt(req.body.correctIndex)
      };
      
      // Process options array if provided as a string
      if (typeof req.body.options === 'string') {
        try {
          questionData.options = JSON.parse(req.body.options);
        } catch (e) {
          questionData.options = req.body.options.split(',').map((item: string) => item.trim());
        }
      }
      
      // Validate and create
      const validatedData = insertQuizQuestionSchema.parse(questionData);
      const question = await storage.createQuizQuestion(validatedData);
      
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/api/admin/questions/:id", isAdmin, async (req, res, next) => {
    try {
      const questionId = parseInt(req.params.id);
      
      // Prepare update data
      let updateData: any = {
        ...req.body
      };
      
      // Handle numeric fields
      if (req.body.topicId) {
        updateData.topicId = parseInt(req.body.topicId);
      }
      
      if (req.body.correctIndex !== undefined) {
        updateData.correctIndex = parseInt(req.body.correctIndex);
      }
      
      // Process options array if provided as a string
      if (typeof req.body.options === 'string') {
        try {
          updateData.options = JSON.parse(req.body.options);
        } catch (e) {
          updateData.options = req.body.options.split(',').map((item: string) => item.trim());
        }
      }
      
      // Validate and update
      const validatedData = insertQuizQuestionSchema.partial().parse(updateData);
      const question = await storage.updateQuizQuestion(questionId, validatedData);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete("/api/admin/questions/:id", isAdmin, async (req, res, next) => {
    try {
      const questionId = parseInt(req.params.id);
      const success = await storage.deleteQuizQuestion(questionId);
      
      if (!success) {
        return res.status(404).json({ error: "Question not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // Register error handler
  app.use(errorHandler);
  
  const httpServer = createServer(app);
  
  return httpServer;
}

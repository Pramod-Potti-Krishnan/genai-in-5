import { db, pool } from "./db";
import { users, topics, audibles, flashcards, quizQuestions } from "@shared/schema";
import { hashPassword } from "./auth";
import { randomUUID } from "crypto";
import { storage } from "./storage";

/**
 * Seeds the database with initial data for development purposes
 */
async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const adminPassword = await hashPassword("admin123");
    await db.insert(users).values({
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      isAdmin: true
    }).onConflictDoNothing({ target: users.email });
    console.log("✅ Admin user created");

    // Create regular user
    const userPassword = await hashPassword("user123");
    await db.insert(users).values({
      email: "user@example.com", 
      name: "Regular User",
      password: userPassword,
      isAdmin: false
    }).onConflictDoNothing({ target: users.email });
    console.log("✅ Regular user created");

    // Create topics
    const topicData = [
      {
        title: "JavaScript Fundamentals",
        description: "Core concepts and features of JavaScript programming language",
        color: "#f7df1e",
        icon: "/uploads/javascript-icon.png"
      },
      {
        title: "Web Development",
        description: "Modern web development techniques and best practices",
        color: "#61dafb",
        icon: "/uploads/web-icon.png"
      },
      {
        title: "Data Structures",
        description: "Essential data structures for efficient programming",
        color: "#4caf50",
        icon: "/uploads/data-structures-icon.png"
      },
      {
        title: "UX Design",
        description: "Principles of user experience design",
        color: "#ff5722",
        icon: "/uploads/ux-icon.png"
      }
    ];

    for (const topic of topicData) {
      await db.insert(topics).values(topic).onConflictDoNothing({ target: topics.title });
    }
    console.log("✅ Topics created");

    // Get topics to reference by ID
    const seededTopics = await db.select().from(topics);
    
    // Create audibles
    const audiblesData = [
      {
        title: "Understanding JavaScript Closures",
        summary: "Learn about closures and how they enable powerful patterns in JavaScript",
        audioUrl: "/uploads/js-closures.mp3",
        lengthSec: 360,
        coverImage: "/uploads/js-closures.jpg",
        topicId: seededTopics.find(t => t.title === "JavaScript Fundamentals")?.id || 1
      },
      {
        title: "Modern CSS Techniques",
        summary: "Explore the latest CSS features that make styling modern websites easier",
        audioUrl: "/uploads/modern-css.mp3",
        lengthSec: 420,
        coverImage: "/uploads/modern-css.jpg",
        topicId: seededTopics.find(t => t.title === "Web Development")?.id || 2
      },
      {
        title: "Building Linked Lists",
        summary: "A deep dive into linked list implementation and applications",
        audioUrl: "/uploads/linked-lists.mp3",
        lengthSec: 510,
        coverImage: "/uploads/linked-lists.jpg",
        topicId: seededTopics.find(t => t.title === "Data Structures")?.id || 3
      },
      {
        title: "Responsive Design Principles",
        summary: "Key concepts for creating websites that work well on all devices",
        audioUrl: "/uploads/responsive-design.mp3",
        lengthSec: 390,
        coverImage: "/uploads/responsive-design.jpg",
        topicId: seededTopics.find(t => t.title === "Web Development")?.id || 2
      },
      {
        title: "Usability Testing Methods",
        summary: "Practical approaches to testing your designs with real users",
        audioUrl: "/uploads/usability-testing.mp3",
        lengthSec: 450,
        coverImage: "/uploads/usability-testing.jpg",
        topicId: seededTopics.find(t => t.title === "UX Design")?.id || 4
      }
    ];

    for (const audible of audiblesData) {
      await db.insert(audibles).values(audible).onConflictDoNothing({ target: audibles.title });
    }
    console.log("✅ Audibles created");

    // Create flashcards
    const flashcardsData = [
      {
        headline: "What is a JavaScript closure?",
        bullets: ["A closure is a function that has access to its own scope, the scope of the outer function, and the global scope."],
        imageUrl: "/uploads/closure-example.jpg",
        topicId: seededTopics.find(t => t.title === "JavaScript Fundamentals")?.id || 1
      },
      {
        headline: "What is the box model in CSS?",
        bullets: ["The CSS box model is a box that wraps around HTML elements, and it consists of margins, borders, padding, and the actual content."],
        imageUrl: "/uploads/box-model.jpg",
        topicId: seededTopics.find(t => t.title === "Web Development")?.id || 2
      },
      {
        headline: "What is the time complexity of array access?",
        bullets: ["O(1) - constant time. Arrays provide direct access to elements using indices."],
        imageUrl: "/uploads/array-complexity.jpg",
        topicId: seededTopics.find(t => t.title === "Data Structures")?.id || 3
      },
      {
        headline: "What is the 'var' keyword in JavaScript?",
        bullets: ["The 'var' keyword declares a function-scoped or globally-scoped variable, optionally initializing it to a value."],
        imageUrl: "/uploads/var-keyword.jpg",
        topicId: seededTopics.find(t => t.title === "JavaScript Fundamentals")?.id || 1
      },
      {
        headline: "What is a design system?",
        bullets: ["A design system is a collection of reusable components, guided by clear standards, that can be assembled to build applications."],
        imageUrl: "/uploads/design-system.jpg",
        topicId: seededTopics.find(t => t.title === "UX Design")?.id || 4
      },
      {
        headline: "What is the difference between flexbox and grid?",
        bullets: ["Flexbox is one-dimensional and designed for layout in a row or column.", "Grid is two-dimensional and enables you to work along both rows and columns."],
        imageUrl: "/uploads/flexbox-vs-grid.jpg",
        topicId: seededTopics.find(t => t.title === "Web Development")?.id || 2
      }
    ];

    for (const flashcard of flashcardsData) {
      await db.insert(flashcards).values(flashcard).onConflictDoNothing();
    }
    console.log("✅ Flashcards created");

    // Create quiz questions
    const quizQuestionsData = [
      {
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Symbol"],
        correctIndex: 2,
        explanation: "Float is not a distinct data type in JavaScript. Numbers are represented by the Number type.",
        topicId: seededTopics.find(t => t.title === "JavaScript Fundamentals")?.id || 1
      },
      {
        question: "Which CSS property is used to control the space between elements?",
        options: ["spacing", "margin", "padding", "gap"],
        correctIndex: 1,
        explanation: "The margin property is used to create space around elements, outside of any defined borders.",
        topicId: seededTopics.find(t => t.title === "Web Development")?.id || 2
      },
      {
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Linked List", "Binary Tree"],
        correctIndex: 1,
        explanation: "A Stack follows the Last In, First Out principle where the last element added is the first one to be removed.",
        topicId: seededTopics.find(t => t.title === "Data Structures")?.id || 3
      },
      {
        question: "What does the 'this' keyword refer to in JavaScript?",
        options: ["The current function", "The parent function", "The function's execution context", "The global window object"],
        correctIndex: 2,
        explanation: "In JavaScript, 'this' refers to the object that is executing the current function.",
        topicId: seededTopics.find(t => t.title === "JavaScript Fundamentals")?.id || 1
      },
      {
        question: "What is the goal of A/B testing in UX design?",
        options: ["To compare two versions of a webpage to see which performs better", "To test if a website works in different browsers", "To check the website's loading time", "To verify the website's security"],
        correctIndex: 0,
        explanation: "A/B testing compares two versions of a webpage to determine which one performs better in terms of user experience and conversions.",
        topicId: seededTopics.find(t => t.title === "UX Design")?.id || 4
      }
    ];

    for (const quiz of quizQuestionsData) {
      await db.insert(quizQuestions).values({
        ...quiz,
        options: JSON.stringify(quiz.options) as any
      }).onConflictDoNothing();
    }
    console.log("✅ Quiz questions created");

    console.log("🌱 Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the seed function
seedDatabase();
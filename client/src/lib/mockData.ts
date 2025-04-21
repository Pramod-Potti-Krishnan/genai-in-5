import { Audible, Section, Flashcard, TriviaCategory, TriviaQuestion } from "@shared/schema";

// Dummy audio URL for all audio files
const DUMMY_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const sections: Section[] = [
  {
    id: 1,
    title: "GenAI Foundations",
    icon: "fa-robot",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "AI in Finance",
    icon: "fa-money-bill-trend-up",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "AI in Healthcare",
    icon: "fa-hospital",
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "Prompt Engineering",
    icon: "fa-keyboard",
    createdAt: new Date(),
  },
  {
    id: 5,
    title: "AI Ethics",
    icon: "fa-scale-balanced",
    createdAt: new Date(),
  },
  {
    id: 6,
    title: "AI Applications",
    icon: "fa-briefcase",
    createdAt: new Date(),
  }
];

export const audibles: Audible[] = [
  {
    id: 1,
    title: "Introduction to Large Language Models",
    description: "Understand the basics of LLMs, their architecture, and how they process natural language.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 300, // 5 minutes
    sectionId: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Prompt Engineering Basics",
    description: "Learn how to craft effective prompts to get the best results from generative AI models.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1677442135196-9412ba0ad344?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 240, // 4 minutes
    sectionId: 1,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "AI for Market Analysis",
    description: "Discover how AI is transforming market research and financial forecasting.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 360, // 6 minutes
    sectionId: 2,
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "Fraud Detection with AI",
    description: "Learn how financial institutions use AI to identify suspicious transactions and prevent fraud.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 300, // 5 minutes
    sectionId: 2,
    createdAt: new Date(),
  },
  {
    id: 5,
    title: "AI Ethics & Responsibility",
    description: "Explore the ethical considerations when deploying AI systems and responsible AI principles.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1655720035441-3e7af3144a55?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 420, // 7 minutes
    sectionId: 5,
    createdAt: new Date(),
  },
  {
    id: 6,
    title: "GenAI Business Cases",
    description: "Examine real-world business applications of generative AI across various industries.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1634141613544-225201d4ef94?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 360, // 6 minutes
    sectionId: 6,
    createdAt: new Date(),
  },
  {
    id: 7,
    title: "AI in Marketing",
    description: "Learn how AI is revolutionizing marketing strategies, personalization, and customer engagement.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1663152444009-41044e44f0cf?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 300, // 5 minutes
    sectionId: 6,
    createdAt: new Date(),
  },
  {
    id: 8,
    title: "Medical Diagnosis with AI",
    description: "Explore how AI is improving diagnostic accuracy and patient outcomes in healthcare.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 360, // 6 minutes
    sectionId: 3,
    createdAt: new Date(),
  },
  {
    id: 9,
    title: "Drug Discovery with AI",
    description: "Learn how artificial intelligence is accelerating the drug discovery and development process.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 300, // 5 minutes
    sectionId: 3,
    createdAt: new Date(),
  },
  {
    id: 10,
    title: "Advanced Prompt Engineering",
    description: "Master advanced techniques for prompting LLMs, including chain-of-thought and few-shot learning.",
    audioUrl: DUMMY_AUDIO_URL,
    coverImage: "https://images.unsplash.com/photo-1669059031585-51341f77275a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=400&h=400",
    durationInSeconds: 360, // 6 minutes
    sectionId: 4,
    createdAt: new Date(),
  }
];

export const flashcards: Flashcard[] = [
  {
    id: 1,
    audibleId: 1,
    title: "Large Language Models",
    sectionId: 1,
    difficulty: "Intermediate",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="50" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M35,60 Q50,80 65,60" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    points: [
      "LLMs are neural networks trained on vast text datasets to predict the next word in a sequence.",
      "Transformer architecture enables models to understand context and relationships between words.",
      "Modern LLMs can perform multiple tasks without task-specific training through prompting."
    ],
    createdAt: new Date(),
  },
  {
    id: 2,
    audibleId: 2,
    title: "Prompt Engineering",
    sectionId: 4,
    difficulty: "Basic",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="40" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="25" y1="45" x2="75" y2="45" stroke="currentColor" stroke-width="2"/>
      <line x1="25" y1="55" x2="60" y2="55" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    points: [
      "Effective prompts include clear instructions, context, and expected output format.",
      "Chain-of-thought prompting helps models solve complex reasoning tasks step-by-step.",
      "Few-shot examples within a prompt can significantly improve model performance."
    ],
    createdAt: new Date(),
  },
  {
    id: 3,
    audibleId: 3,
    title: "Market Analysis",
    sectionId: 2,
    difficulty: "Intermediate",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,80 L20,20 L80,20" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M30,70 L40,50 L50,60 L60,40 L70,30" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="30" cy="70" r="3" fill="currentColor"/>
      <circle cx="40" cy="50" r="3" fill="currentColor"/>
      <circle cx="50" cy="60" r="3" fill="currentColor"/>
      <circle cx="60" cy="40" r="3" fill="currentColor"/>
      <circle cx="70" cy="30" r="3" fill="currentColor"/>
    </svg>`,
    points: [
      "AI can analyze market trends from vast datasets much faster than human analysts.",
      "Machine learning models can predict market movements with increasing accuracy.",
      "Natural language processing analyzes news and social media for market sentiment."
    ],
    createdAt: new Date(),
  },
  {
    id: 4,
    audibleId: 4,
    title: "Fraud Detection",
    sectionId: 2,
    difficulty: "Advanced",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M35,35 L65,65 M65,35 L35,65" stroke="currentColor" stroke-width="2"/>
      <path d="M50,30 L50,70" stroke="currentColor" stroke-width="2" stroke-dasharray="2,2"/>
    </svg>`,
    points: [
      "AI systems can detect unusual patterns that indicate potential fraud in real-time.",
      "Machine learning models continuously improve fraud detection by learning from new cases.",
      "Behavioral biometrics uses AI to verify user identity based on interaction patterns."
    ],
    createdAt: new Date(),
  },
  {
    id: 5,
    audibleId: 5,
    title: "AI Ethics",
    sectionId: 5,
    difficulty: "Intermediate",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,20 L80,40 L80,70 L50,90 L20,70 L20,40 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="20" y1="40" x2="80" y2="70" stroke="currentColor" stroke-width="1"/>
      <line x1="20" y1="70" x2="80" y2="40" stroke="currentColor" stroke-width="1"/>
    </svg>`,
    points: [
      "Responsible AI development requires transparency in how decisions are made.",
      "Bias in training data can lead to unfair or discriminatory AI outcomes.",
      "Ethical frameworks help guide AI development toward beneficial societal outcomes."
    ],
    createdAt: new Date(),
  },
  {
    id: 6,
    audibleId: 6,
    title: "GenAI Business Impact",
    sectionId: 6,
    difficulty: "Basic",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="40" width="20" height="40" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="55" y="30" width="20" height="50" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M20,80 L80,80" stroke="currentColor" stroke-width="2"/>
      <path d="M35,30 L65,20" stroke="currentColor" stroke-width="2" stroke-dasharray="2,2"/>
    </svg>`,
    points: [
      "Generative AI is creating new revenue streams across multiple business sectors.",
      "Content creation, customer service, and product design are being transformed by GenAI.",
      "Cost savings and efficiency gains are primary drivers of GenAI business adoption."
    ],
    createdAt: new Date(),
  },
  {
    id: 7,
    audibleId: 7,
    title: "AI in Marketing",
    sectionId: 6,
    difficulty: "Intermediate",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="50" y1="20" x2="50" y2="30" stroke="currentColor" stroke-width="2"/>
      <line x1="50" y1="70" x2="50" y2="80" stroke="currentColor" stroke-width="2"/>
      <line x1="20" y1="50" x2="30" y2="50" stroke="currentColor" stroke-width="2"/>
      <line x1="70" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    points: [
      "AI enables hyper-personalization of marketing messages based on individual behavior.",
      "Predictive analytics helps marketers identify high-value prospects and opportunities.",
      "AI-powered content generation can optimize headlines, emails, and ad copy for engagement."
    ],
    createdAt: new Date(),
  },
  {
    id: 8,
    audibleId: 8,
    title: "Medical Imaging",
    sectionId: 3,
    difficulty: "Advanced",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="60" cy="40" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M30,60 Q40,30 55,45 Q70,60 70,70" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    points: [
      "AI can detect patterns in medical images that human clinicians might miss.",
      "Machine learning models are increasingly accurate at early disease detection.",
      "AI diagnostic tools can help address physician shortages in underserved areas."
    ],
    createdAt: new Date(),
  },
  {
    id: 9,
    audibleId: 9,
    title: "Drug Discovery",
    sectionId: 3,
    difficulty: "Advanced",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="40" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="50" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="70" cy="40" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="40" cy="60" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="60" cy="60" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="30" y1="40" x2="50" y2="30" stroke="currentColor" stroke-width="2"/>
      <line x1="50" y1="30" x2="70" y2="40" stroke="currentColor" stroke-width="2"/>
      <line x1="70" y1="40" x2="60" y2="60" stroke="currentColor" stroke-width="2"/>
      <line x1="60" y1="60" x2="40" y2="60" stroke="currentColor" stroke-width="2"/>
      <line x1="40" y1="60" x2="30" y2="40" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    points: [
      "AI can predict protein folding and molecular interactions for drug development.",
      "Machine learning accelerates compound screening by predicting effectiveness.",
      "AI reduces the time and cost of bringing new treatments to market."
    ],
    createdAt: new Date(),
  },
  {
    id: 10,
    audibleId: 10,
    title: "Advanced Prompting",
    sectionId: 4,
    difficulty: "Advanced",
    lineIllustration: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="40" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M30,40 L70,40 M30,50 L70,50 M30,60 L70,60" stroke="currentColor" stroke-width="2"/>
      <path d="M25,35 L35,45 M25,45 L35,35" stroke="currentColor" stroke-width="1"/>
      <path d="M65,55 L75,65 M65,65 L75,55" stroke="currentColor" stroke-width="1"/>
    </svg>`,
    points: [
      "Format engineering structures prompts for optimal model comprehension.",
      "Role-based prompting assigns specific personas to the AI for tailored responses.",
      "Instruction tuning refines prompt techniques based on model-specific behaviors."
    ],
    createdAt: new Date(),
  }
];

export const triviaCategories: TriviaCategory[] = [
  {
    id: 1,
    title: "GenAI Basics",
    icon: "fa-robot",
    iconBgColor: "bg-blue-100",
    iconTextColor: "text-primary",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Prompt Engineering",
    icon: "fa-keyboard",
    iconBgColor: "bg-purple-100",
    iconTextColor: "text-purple-600",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "AI Ethics",
    icon: "fa-scale-balanced",
    iconBgColor: "bg-green-100",
    iconTextColor: "text-green-600",
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "AI Applications",
    icon: "fa-briefcase",
    iconBgColor: "bg-orange-100",
    iconTextColor: "text-orange-600",
    createdAt: new Date(),
  }
];

export const triviaQuestions: TriviaQuestion[] = [
  // GenAI Basics Questions
  {
    id: 1,
    categoryId: 1,
    question: "What is the primary architecture used in large language models like GPT?",
    options: ["Transformer", "Convolutional Neural Network (CNN)", "Recurrent Neural Network (RNN)", "Generative Adversarial Network (GAN)"],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 2,
    categoryId: 1,
    question: "What does 'zero-shot learning' refer to in the context of LLMs?",
    options: [
      "The ability to perform tasks without specific training examples", 
      "Learning from exactly zero data points", 
      "A model that makes no predictions", 
      "Training with no computational resources"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 3,
    categoryId: 1,
    question: "Which of these is NOT a common application of generative AI?",
    options: [
      "Hardware acceleration", 
      "Text generation", 
      "Image creation", 
      "Audio synthesis"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 4,
    categoryId: 1,
    question: "What is 'attention' in transformer-based models?",
    options: [
      "A mechanism that weighs the importance of different words in relation to each other", 
      "The model's ability to focus on training", 
      "A measure of user engagement with model outputs", 
      "The computing resources allocated to training"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 5,
    categoryId: 1,
    question: "What is 'fine-tuning' in the context of LLMs?",
    options: [
      "Further training a pre-trained model on a specific dataset for specialized tasks", 
      "Optimizing the model's hardware performance", 
      "Reducing the model size without losing functionality", 
      "Increasing the model's training batch size"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 6,
    categoryId: 1,
    question: "What does 'hallucination' refer to in LLMs?",
    options: [
      "When a model generates false or nonsensical information", 
      "When a model crashes during training", 
      "When a model successfully identifies images", 
      "When a model becomes too large to deploy"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 7,
    categoryId: 1,
    question: "What is 'tokenization' in language models?",
    options: [
      "Breaking text into smaller units for processing", 
      "Converting text to financial credits", 
      "Encrypting sensitive information", 
      "Adding security features to the model"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 8,
    categoryId: 1,
    question: "Which company released the first version of GPT?",
    options: [
      "OpenAI", 
      "Google", 
      "Microsoft", 
      "Meta"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 9,
    categoryId: 1,
    question: "What is 'perplexity' measuring in language models?",
    options: [
      "How well the model predicts a sample", 
      "Model complexity", 
      "Training duration", 
      "Hardware requirements"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 10,
    categoryId: 1,
    question: "Which of these is NOT a type of generative AI model?",
    options: [
      "Binary Classification Model", 
      "Variational Autoencoder", 
      "Diffusion Model", 
      "Generative Adversarial Network"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  
  // Prompt Engineering Questions
  {
    id: 11,
    categoryId: 2,
    question: "What is 'chain of thought' prompting?",
    options: [
      "Guiding the model to show its reasoning step by step", 
      "Using multiple prompts in sequence", 
      "Having one AI model prompt another", 
      "Creating a loop of self-referential prompts"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 12,
    categoryId: 2,
    question: "What does 'few-shot prompting' refer to?",
    options: [
      "Providing examples in the prompt to guide the model's response", 
      "Using very short prompts", 
      "Limiting the model's output length", 
      "Prompting with minimal computing resources"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  
  // Add more questions for each category...
  
  // AI Ethics Questions
  {
    id: 21,
    categoryId: 3,
    question: "What is 'algorithmic bias'?",
    options: [
      "When algorithms produce unfair or prejudiced results", 
      "A preference for one algorithm over another", 
      "The computational angle in neural networks", 
      "The energy consumption of AI models"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  },
  
  // AI Applications Questions
  {
    id: 31,
    categoryId: 4,
    question: "In which field is AI NOT commonly applied?",
    options: [
      "Underwater basket weaving", 
      "Healthcare diagnostics", 
      "Financial fraud detection", 
      "Customer service automation"
    ],
    correctOptionIndex: 0,
    createdAt: new Date(),
  }
];

// Progress structure to track user advancements
export interface UserProgressData {
  completedAudibles: number[];
  audibleProgress: Record<number, number>; // audibleId -> progress (0-100%)
  reviewedFlashcards: number[];
  triviaScores: Record<number, {score: number, total: number}>; // categoryId -> {score, total}
  streakDays: number;
}

export const defaultUserProgress: UserProgressData = {
  completedAudibles: [1, 2],
  audibleProgress: {
    1: 100,
    2: 100,
    3: 40,
    4: 20,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0
  },
  reviewedFlashcards: [1],
  triviaScores: {
    1: {score: 8, total: 10},
    2: {score: 6, total: 10}
  },
  streakDays: 4
};

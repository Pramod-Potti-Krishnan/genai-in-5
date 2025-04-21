import { Section, Audible, Flashcard, TriviaCategory, TriviaQuestion } from "@/types";

// Mock audio URL (5 second sample)
const dummyAudioUrl = "https://assets.coderrocketfuel.com/pomodoro-times-up.mp3";

// Sections with audibles
export const mockSections: Section[] = [
  {
    id: "genai-foundations",
    title: "GenAI Foundations",
    icon: "Lightbulb",
    color: "primary",
    audibles: [
      {
        id: "intro-to-llms",
        title: "Introduction to LLMs",
        summary: "An overview of large language models and how they're transforming AI applications.",
        duration: 420, // 7 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "genai-foundations"
      },
      {
        id: "prompt-engineering-basics",
        title: "Prompt Engineering Basics",
        summary: "Learn how to craft effective prompts to get the best results from generative AI models.",
        duration: 720, // 12 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "genai-foundations"
      },
      {
        id: "llm-architecture",
        title: "LLM Architecture Explained",
        summary: "Understand the technical architecture that powers large language models.",
        duration: 480, // 8 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "genai-foundations"
      },
      {
        id: "multimodal-ai",
        title: "Multimodal AI Models",
        summary: "Explore AI models that can process multiple types of data like text, images, and audio.",
        duration: 600, // 10 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "genai-foundations"
      },
      {
        id: "fine-tuning-llms",
        title: "Fine-tuning LLMs",
        summary: "How to customize pre-trained models for specific use cases and domains.",
        duration: 660, // 11 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "genai-foundations"
      }
    ]
  },
  {
    id: "ai-in-finance",
    title: "AI in Finance",
    icon: "DollarSign",
    color: "blue",
    audibles: [
      {
        id: "ai-fraud-detection",
        title: "AI for Fraud Detection",
        summary: "How financial institutions use AI to identify and prevent fraudulent transactions.",
        duration: 540, // 9 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-in-finance"
      },
      {
        id: "algorithmic-trading",
        title: "Algorithmic Trading with AI",
        summary: "Understanding how AI is revolutionizing stock market trading strategies.",
        duration: 780, // 13 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-in-finance"
      },
      {
        id: "risk-assessment",
        title: "AI-Driven Risk Assessment",
        summary: "Modern approaches to credit scoring and risk analysis using machine learning.",
        duration: 600, // 10 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-in-finance"
      },
      {
        id: "customer-personalization",
        title: "Personalized Financial Services",
        summary: "How AI enables banks to customize products and services for individual customers.",
        duration: 720, // 12 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-in-finance"
      },
      {
        id: "ai-business-ethics",
        title: "AI Ethics in Business",
        summary: "Ethical considerations when implementing AI in financial decision-making.",
        duration: 900, // 15 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-in-finance"
      }
    ]
  },
  {
    id: "ai-ethics",
    title: "AI Ethics & Safety",
    icon: "ShieldCheck",
    color: "green",
    audibles: [
      {
        id: "bias-fairness",
        title: "Bias and Fairness in AI",
        summary: "Understanding and mitigating biases in AI systems to ensure fair outcomes.",
        duration: 780, // 13 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-ethics"
      },
      {
        id: "transparency-explainability",
        title: "Transparency and Explainability",
        summary: "Methods for making AI decision-making processes more understandable to humans.",
        duration: 660, // 11 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-ethics"
      },
      {
        id: "privacy-security",
        title: "Privacy and Data Security",
        summary: "Protecting user data and maintaining privacy in AI applications.",
        duration: 720, // 12 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-ethics"
      },
      {
        id: "ai-governance",
        title: "AI Governance Frameworks",
        summary: "Regulatory approaches and industry standards for responsible AI development.",
        duration: 840, // 14 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-ethics"
      },
      {
        id: "ai-safety-research",
        title: "AI Safety Research",
        summary: "Current research directions in ensuring AI systems remain safe and beneficial.",
        duration: 600, // 10 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "ai-ethics"
      }
    ]
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    icon: "Edit",
    color: "blue",
    audibles: [
      {
        id: "prompt-techniques",
        title: "Advanced Prompt Techniques",
        summary: "Specialized approaches for getting the most out of language models.",
        duration: 780, // 13 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "prompt-engineering"
      },
      {
        id: "chain-of-thought",
        title: "Chain-of-Thought Prompting",
        summary: "How to guide models through complex reasoning processes step by step.",
        duration: 660, // 11 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "prompt-engineering"
      },
      {
        id: "few-shot-learning",
        title: "Few-Shot Learning Patterns",
        summary: "Techniques for teaching models new tasks with minimal examples.",
        duration: 540, // 9 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "prompt-engineering"
      },
      {
        id: "prompt-injection",
        title: "Preventing Prompt Injection",
        summary: "Security best practices to protect AI systems from adversarial prompts.",
        duration: 600, // 10 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "prompt-engineering"
      },
      {
        id: "domain-specific-prompting",
        title: "Domain-Specific Prompting",
        summary: "Tailoring prompts for specific industries and specialized knowledge areas.",
        duration: 720, // 12 minutes in seconds
        audioUrl: dummyAudioUrl,
        sectionId: "prompt-engineering"
      }
    ]
  }
];

// Flashcards for revision
export const mockFlashcards: Flashcard[] = [
  {
    id: "flashcard-1",
    audibleId: "intro-to-llms",
    sectionTitle: "GenAI Foundations",
    audibleTitle: "Introduction to LLMs",
    difficulty: "Basic",
    keyPoints: [
      "LLMs are neural networks trained on vast text data to predict the next word in a sequence.",
      "They use transformer architecture with attention mechanisms to understand context.",
      "Common models include GPT, LLaMA, and PaLM, each with different parameter sizes and capabilities."
    ]
  },
  {
    id: "flashcard-2",
    audibleId: "prompt-engineering-basics",
    sectionTitle: "GenAI Foundations",
    audibleTitle: "Prompt Engineering Basics",
    difficulty: "Basic",
    keyPoints: [
      "Clear instructions, specific context, and examples improve model outputs dramatically.",
      "Chain-of-thought prompting helps models reason through complex problems step by step.",
      "Role-based prompting (e.g., 'Act as a historian') can focus the model's knowledge and response style."
    ]
  },
  {
    id: "flashcard-3",
    audibleId: "ai-business-ethics",
    sectionTitle: "AI in Finance",
    audibleTitle: "AI Ethics in Business",
    difficulty: "Intermediate",
    keyPoints: [
      "Financial AI systems must balance accuracy with fairness and transparency.",
      "Explainable AI is crucial for financial decisions that impact customers.",
      "Regulatory compliance requires traceability in AI decision-making processes."
    ]
  },
  {
    id: "flashcard-4",
    audibleId: "multimodal-ai",
    sectionTitle: "GenAI Foundations",
    audibleTitle: "Multimodal AI Models",
    difficulty: "Intermediate",
    keyPoints: [
      "Multimodal models can process and generate content across text, images, audio, and video.",
      "Cross-modal understanding allows models to translate concepts between different data types.",
      "Applications include content generation, accessibility tools, and enhanced search capabilities."
    ]
  },
  {
    id: "flashcard-5",
    audibleId: "bias-fairness",
    sectionTitle: "AI Ethics & Safety",
    audibleTitle: "Bias and Fairness in AI",
    difficulty: "Advanced",
    keyPoints: [
      "AI systems can inherit and amplify biases present in their training data.",
      "Fairness metrics often involve tradeoffs and require alignment with social values.",
      "Diverse data collection and careful preprocessing can help mitigate some forms of bias."
    ]
  },
  {
    id: "flashcard-6",
    audibleId: "chain-of-thought",
    sectionTitle: "Prompt Engineering",
    audibleTitle: "Chain-of-Thought Prompting",
    difficulty: "Intermediate",
    keyPoints: [
      "Breaking down complex reasoning into sequential steps improves model accuracy.",
      "Explicitly asking models to 'think step by step' often yields more logical answers.",
      "Chain-of-thought is most effective for math, logic, and analytical reasoning tasks."
    ]
  },
  {
    id: "flashcard-7",
    audibleId: "algorithmic-trading",
    sectionTitle: "AI in Finance",
    audibleTitle: "Algorithmic Trading with AI",
    difficulty: "Advanced",
    keyPoints: [
      "Machine learning models can identify market patterns too subtle for human traders.",
      "Reinforcement learning enables trading systems to adapt to changing market conditions.",
      "Risk management remains crucial despite AI's predictive capabilities."
    ]
  }
];

// Trivia categories
export const mockTriviaCategories: TriviaCategory[] = [
  {
    id: "genai-basics",
    title: "GenAI Basics",
    icon: "Lightbulb",
    color: "primary",
    questionCount: 10
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    icon: "Edit",
    color: "blue",
    questionCount: 10
  },
  {
    id: "ai-ethics",
    title: "AI Ethics",
    icon: "ShieldCheck",
    color: "green",
    questionCount: 10
  },
  {
    id: "ai-applications",
    title: "AI Applications",
    icon: "Flask",
    color: "purple",
    questionCount: 10
  }
];

// Trivia questions
export const mockTriviaQuestions: Record<string, TriviaQuestion[]> = {
  "genai-basics": [
    {
      id: "genai-q1",
      categoryId: "genai-basics",
      question: "What is the primary advantage of a transformer architecture over RNNs in language models?",
      options: [
        "Ability to process sequences in parallel rather than sequentially",
        "Lower computational requirements",
        "Smaller model size with the same capabilities",
        "Faster training on smaller datasets"
      ],
      correctAnswer: 0
    },
    {
      id: "genai-q2",
      categoryId: "genai-basics",
      question: "Which of the following best describes what happens during the 'pre-training' phase of an LLM?",
      options: [
        "The model is specialized for specific tasks through human feedback",
        "The model learns general language patterns from massive text corpora",
        "The model is tested on benchmark datasets to evaluate performance",
        "The model's parameters are manually adjusted by engineers"
      ],
      correctAnswer: 1
    },
    {
      id: "genai-q3",
      categoryId: "genai-basics",
      question: "What does 'token' refer to in the context of language models?",
      options: [
        "A security credential for API access",
        "A unit of text that the model processes (like a word or part of a word)",
        "A measure of computational power required",
        "A method for classifying text content"
      ],
      correctAnswer: 1
    },
    {
      id: "genai-q4",
      categoryId: "genai-basics",
      question: "What is 'hallucination' in the context of generative AI?",
      options: [
        "When a model creates realistic but false information",
        "When a model refuses to generate potentially harmful content",
        "When a model generates abstract or artistic outputs",
        "When a model requires recalibration due to performance issues"
      ],
      correctAnswer: 0
    },
    {
      id: "genai-q5",
      categoryId: "genai-basics",
      question: "Which component is NOT typically part of a transformer-based language model architecture?",
      options: [
        "Self-attention mechanism",
        "Feed-forward neural networks",
        "Convolutional layers",
        "Positional encodings"
      ],
      correctAnswer: 2
    },
    {
      id: "genai-q6",
      categoryId: "genai-basics",
      question: "What does 'zero-shot learning' refer to in the context of LLMs?",
      options: [
        "Training a model without any data",
        "A model performing a task without specific examples of that task in its training",
        "Learning that requires zero computational resources",
        "A technique where the model produces no output until fully confident"
      ],
      correctAnswer: 1
    },
    {
      id: "genai-q7",
      categoryId: "genai-basics",
      question: "What is the main purpose of 'fine-tuning' an LLM?",
      options: [
        "Reducing the model's size for faster inference",
        "Adapting a general-purpose model for specific tasks or domains",
        "Fixing factual errors in the model's knowledge base",
        "Making the model's responses more concise"
      ],
      correctAnswer: 1
    },
    {
      id: "genai-q8",
      categoryId: "genai-basics",
      question: "Which of these is NOT a common challenge with large language models?",
      options: [
        "Biased outputs reflecting training data biases",
        "Excessive energy consumption for training and inference",
        "Limited contextual understanding beyond their context window",
        "Inability to process non-English languages"
      ],
      correctAnswer: 3
    },
    {
      id: "genai-q9",
      categoryId: "genai-basics",
      question: "What does 'multimodal AI' refer to?",
      options: [
        "AI systems that can operate across multiple computational platforms",
        "AI systems that can process and generate multiple types of data (text, images, etc.)",
        "AI models that are trained on data from multiple different organizations",
        "AI that can perform multiple different tasks simultaneously"
      ],
      correctAnswer: 1
    },
    {
      id: "genai-q10",
      categoryId: "genai-basics",
      question: "What is 'temperature' in the context of generative AI text generation?",
      options: [
        "A measure of how efficiently the model processes inputs",
        "A parameter controlling how random or deterministic the model's outputs are",
        "The computational heat generated during inference",
        "A metric tracking how emotionally charged the generated text is"
      ],
      correctAnswer: 1
    }
  ],
  "prompt-engineering": [
    {
      id: "prompt-q1",
      categoryId: "prompt-engineering",
      question: "What is 'chain-of-thought prompting'?",
      options: [
        "A technique to link multiple prompts together for extended conversations",
        "A method that encourages the model to show its reasoning process step by step",
        "A way to enforce strict logical consistency in model outputs",
        "A technique for passing prompts between different AI models"
      ],
      correctAnswer: 1
    },
    {
      id: "prompt-q2",
      categoryId: "prompt-engineering",
      question: "Which of these is NOT a recommended practice in prompt engineering?",
      options: [
        "Being specific and providing clear instructions",
        "Keeping prompts as brief as possible to save processing time",
        "Including examples of desired outputs when appropriate",
        "Providing context relevant to the task"
      ],
      correctAnswer: 1
    },
    {
      id: "prompt-q3",
      categoryId: "prompt-engineering",
      question: "What is 'few-shot learning' in the context of prompting?",
      options: [
        "Training a model on very small datasets",
        "Including a few examples in the prompt to guide the model's response",
        "Limiting the model to generating only a few sentences",
        "A technique where the model learns new capabilities from minimal interactions"
      ],
      correctAnswer: 1
    },
    {
      id: "prompt-q4",
      categoryId: "prompt-engineering",
      question: "What is 'prompt injection'?",
      options: [
        "Adding examples to a prompt to improve performance",
        "A technique to insert specialized knowledge into model responses",
        "A security vulnerability where users override system prompts with malicious instructions",
        "Automatically generating prompts from user behavior patterns"
      ],
      correctAnswer: 2
    },
    {
      id: "prompt-q5",
      categoryId: "prompt-engineering",
      question: "When using role-based prompting, what are you instructing the AI to do?",
      options: [
        "Adopt a specific persona or expertise when responding",
        "Limit responses to predefined scripts",
        "Analyze different character roles in a text",
        "Assign roles to different parts of the conversation"
      ],
      correctAnswer: 0
    },
    {
      id: "prompt-q6",
      categoryId: "prompt-engineering",
      question: "What is 'zero-shot prompting'?",
      options: [
        "Asking a model to perform a task without giving it any examples",
        "Using an empty prompt to test model behavior",
        "A technique that requires no computing resources",
        "Creating prompts that intentionally generate no output"
      ],
      correctAnswer: 0
    },
    {
      id: "prompt-q7",
      categoryId: "prompt-engineering",
      question: "Which of these is an example of effective prompt refinement?",
      options: [
        "Making prompts longer by adding irrelevant details",
        "Iteratively adjusting prompts based on model responses",
        "Using technical jargon regardless of the task",
        "Repeating the same prompt multiple times"
      ],
      correctAnswer: 1
    },
    {
      id: "prompt-q8",
      categoryId: "prompt-engineering",
      question: "What is 'prompt leaking'?",
      options: [
        "When sensitive information from prompts is shared accidentally",
        "When a model reveals parts of its system prompt in responses",
        "When model outputs gradually drift from the initial prompt",
        "When prompt strategies are published without permission"
      ],
      correctAnswer: 1
    },
    {
      id: "prompt-q9",
      categoryId: "prompt-engineering",
      question: "Which prompting technique uses defined formats like JSON or XML to structure model outputs?",
      options: [
        "Template prompting",
        "Structured output prompting",
        "Format control",
        "Schema-guided generation"
      ],
      correctAnswer: 1
    },
    {
      id: "prompt-q10",
      categoryId: "prompt-engineering",
      question: "What is the 'system prompt' in applications like ChatGPT?",
      options: [
        "The initial message that loads when the application starts",
        "Hidden instructions that define the AI's behavior and personality",
        "Automated prompts generated by the system based on user behavior",
        "Error messages when the model fails to generate a response"
      ],
      correctAnswer: 1
    }
  ],
  "ai-ethics": [
    {
      id: "ethics-q1",
      categoryId: "ai-ethics",
      question: "What is 'algorithmic bias' in AI systems?",
      options: [
        "A technical optimization that speeds up AI processing",
        "When AI systems systematically produce unfair or prejudiced outputs",
        "The preference for certain algorithms over others in system design",
        "Mathematical errors in the underlying code"
      ],
      correctAnswer: 1
    },
    {
      id: "ethics-q2",
      categoryId: "ai-ethics",
      question: "Which of the following best describes the concept of 'explainable AI'?",
      options: [
        "AI systems that can explain human behaviors",
        "AI systems whose decision-making processes can be understood by humans",
        "AI that uses natural language to communicate with users",
        "AI that explains itself to other AI systems"
      ],
      correctAnswer: 1
    },
    {
      id: "ethics-q3",
      categoryId: "ai-ethics",
      question: "What is a key challenge in creating fair AI systems?",
      options: [
        "Making systems that are completely objective and unbiased",
        "Balancing multiple, sometimes conflicting, definitions of fairness",
        "Ensuring all AI systems use the same fairness metrics",
        "Preventing users from misinterpreting AI outputs"
      ],
      correctAnswer: 1
    },
    {
      id: "ethics-q4",
      categoryId: "ai-ethics",
      question: "What does 'privacy-preserving AI' aim to accomplish?",
      options: [
        "Keeping AI development projects confidential",
        "Hiding how AI systems work from users",
        "Developing AI systems that can function without collecting data",
        "Protecting individuals' data while still creating effective AI models"
      ],
      correctAnswer: 3
    },
    {
      id: "ethics-q5",
      categoryId: "ai-ethics",
      question: "Which of these is NOT typically considered an AI ethics principle?",
      options: [
        "Transparency",
        "Fairness",
        "Proprietary advantage",
        "Harm reduction"
      ],
      correctAnswer: 2
    },
    {
      id: "ethics-q6",
      categoryId: "ai-ethics",
      question: "What is 'value alignment' in the context of AI ethics?",
      options: [
        "Ensuring AI systems' behaviors align with human values and intentions",
        "Aligning the financial value of AI with development costs",
        "Coordinating values across different AI systems",
        "Mathematically optimizing value functions in algorithms"
      ],
      correctAnswer: 0
    },
    {
      id: "ethics-q7",
      categoryId: "ai-ethics",
      question: "What is 'data sovereignty' related to?",
      options: [
        "The idea that the most data-rich companies should control AI development",
        "Allowing individuals to delete all their data from AI systems",
        "The right of nations or groups to control data collection and use in their territories",
        "Techniques for verifying data accuracy"
      ],
      correctAnswer: 2
    },
    {
      id: "ethics-q8",
      categoryId: "ai-ethics",
      question: "Which approach involves training AI models on anonymized data?",
      options: [
        "Synthetic modeling",
        "Differential privacy",
        "Zero-knowledge systems",
        "Homomorphic encryption"
      ],
      correctAnswer: 1
    },
    {
      id: "ethics-q9",
      categoryId: "ai-ethics",
      question: "What is the main goal of AI safety research?",
      options: [
        "Preventing physical injuries from robots",
        "Ensuring AI systems remain controlled by and beneficial to humans",
        "Securing AI systems against cyber attacks",
        "Preventing job losses due to automation"
      ],
      correctAnswer: 1
    },
    {
      id: "ethics-q10",
      categoryId: "ai-ethics",
      question: "What is a 'black box' problem in AI?",
      options: [
        "When AI equipment overheats and fails",
        "When AI predictions are inaccurate",
        "When developers can't explain how AI reaches its decisions",
        "When AI hardware malfunctions"
      ],
      correctAnswer: 2
    }
  ],
  "ai-applications": [
    {
      id: "apps-q1",
      categoryId: "ai-applications",
      question: "Which field has seen AI applications in tumor detection and medical imaging analysis?",
      options: [
        "Finance",
        "Agriculture",
        "Healthcare",
        "Transportation"
      ],
      correctAnswer: 2
    },
    {
      id: "apps-q2",
      categoryId: "ai-applications",
      question: "What is a primary application of AI in modern agriculture?",
      options: [
        "Automated harvesting of all crops",
        "Precision farming for optimized resource use",
        "Completely replacing human farmers",
        "Genetic engineering of new crop varieties"
      ],
      correctAnswer: 1
    },
    {
      id: "apps-q3",
      categoryId: "ai-applications",
      question: "Which AI application helps reduce energy consumption in data centers?",
      options: [
        "Predictive maintenance",
        "Customer service chatbots",
        "Cooling optimization systems",
        "Facial recognition"
      ],
      correctAnswer: 2
    },
    {
      id: "apps-q4",
      categoryId: "ai-applications",
      question: "How is AI typically used in modern email systems?",
      options: [
        "Automatically writing all emails for users",
        "Spam filtering and smart categorization",
        "Real-time translation of all messages",
        "Sending emails at optimal times without user input"
      ],
      correctAnswer: 1
    },
    {
      id: "apps-q5",
      categoryId: "ai-applications",
      question: "Which AI application has transformed how companies handle customer service?",
      options: [
        "Emotional recognition cameras",
        "Automated satisfaction surveys",
        "Conversational chatbots and virtual assistants",
        "Mandatory customer training programs"
      ],
      correctAnswer: 2
    },
    {
      id: "apps-q6",
      categoryId: "ai-applications",
      question: "What is a key use of AI in modern financial fraud detection?",
      options: [
        "Replacing all human analysts with AI systems",
        "Identifying unusual patterns that may indicate fraudulent activity",
        "Automatically blocking all international transactions",
        "Creating fake transactions to test system security"
      ],
      correctAnswer: 1
    },
    {
      id: "apps-q7",
      categoryId: "ai-applications",
      question: "How is computer vision AI used in manufacturing?",
      options: [
        "Exclusively for employee monitoring",
        "Quality control and defect detection",
        "Replacing all human workers on assembly lines",
        "Designing new factory layouts"
      ],
      correctAnswer: 1
    },
    {
      id: "apps-q8",
      categoryId: "ai-applications",
      question: "Which describes an application of AI in smart cities?",
      options: [
        "Completely autonomous city management without human oversight",
        "Traffic flow optimization and predictive maintenance of infrastructure",
        "Elimination of all human-driven vehicles",
        "Mandatory monitoring of all citizen activities"
      ],
      correctAnswer: 1
    },
    {
      id: "apps-q9",
      categoryId: "ai-applications",
      question: "How is AI commonly applied in modern streaming services?",
      options: [
        "Creating all new content without human writers",
        "Automatically censoring content based on user age",
        "Personalized content recommendations based on viewing history",
        "Setting subscription prices based on individual user data"
      ],
      correctAnswer: 2
    },
    {
      id: "apps-q10",
      categoryId: "ai-applications",
      question: "Which AI application is transforming language translation services?",
      options: [
        "Real-time translation of speech and text across multiple languages",
        "Creating new universal languages to replace existing ones",
        "Eliminating the need for humans to learn multiple languages",
        "Automated creation of language learning courses"
      ],
      correctAnswer: 0
    }
  ]
};

// Recent audibles for home screen
export const recentAudibles = [
  mockSections[0].audibles[2], // LLM Architecture Explained
  mockSections[1].audibles[4], // AI Ethics in Business
  mockSections[0].audibles[3]  // Multimodal AI Models
];

// Get next audible (for home screen)
export const getNextAudible = (): Audible => {
  return mockSections[0].audibles[1]; // Prompt Engineering Basics
};

// Get an audible by ID
export const getAudibleById = (id: string): Audible | undefined => {
  for (const section of mockSections) {
    const audible = section.audibles.find(a => a.id === id);
    if (audible) return audible;
  }
  return undefined;
};

// Get flashcards for completed audibles
export const getFlashcardsForAudibles = (completedAudibleIds: string[]): Flashcard[] => {
  return mockFlashcards.filter(card => completedAudibleIds.includes(card.audibleId));
};

// Get trivia questions for a category
export const getTriviaQuestions = (categoryId: string): TriviaQuestion[] => {
  return mockTriviaQuestions[categoryId] || [];
};

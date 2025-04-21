export interface LeaderboardMetric {
  title: string;
  value: string | number;
  rank?: number; // as percentage, e.g. top 12%
  icon: string;
  total?: number;
  current?: number;
}

export interface UserStats {
  progressRank: LeaderboardMetric;
  weeklyScore: LeaderboardMetric;
  monthlyRank: LeaderboardMetric;
}

export const userStats: UserStats = {
  progressRank: {
    title: "Progress Rank",
    value: "Top 12%",
    rank: 12,
    icon: "📈"
  },
  weeklyScore: {
    title: "Weekly Score",
    value: "86 / 100",
    icon: "⭐",
    current: 86,
    total: 100
  },
  monthlyRank: {
    title: "Monthly Rank",
    value: "274 / 300",
    icon: "🏆",
    current: 274,
    total: 300
  }
};

export interface WeeklyPulse {
  id: string;
  title: string;
  date: string;
  summary: string;
  audioUrl: string;
  duration: number; // in seconds
  coverImage?: string;
}

export interface MonthlyRoundup {
  id: string;
  title: string;
  date: string;
  summary: string;
  audioUrl: string;
  duration: number; // in seconds
  coverImage?: string;
}

export interface RecentUpdate {
  id: string;
  title: string;
  date: string;
  summary: string;
  audioUrl: string;
  duration: number; // in seconds
  coverImage?: string;
}

export interface DailyFlash {
  id: string;
  title: string;
  date: string;
  summary: string;
  audioUrl: string;
  duration: number; // in seconds
  coverImage?: string;
}

// Weekly Pulse - 4 most recent weekly roundups
export const weeklyPulseData: WeeklyPulse[] = [
  {
    id: "wp1",
    title: "AI Agents & Custom GPTs",
    date: "Apr 15-21, 2025",
    summary: "This week's biggest advancements in AI agent architecture and custom GPT deployments",
    audioUrl: "/audio/weekly-pulse-1.mp3",
    duration: 300, // 5 minutes
    coverImage: "https://ui-avatars.com/api/?name=AI+Agents&background=6D28D9&color=fff&format=svg"
  },
  {
    id: "wp2",
    title: "Multimodal Models & Vision",
    date: "Apr 8-14, 2025",
    summary: "Breaking developments in multimodal AI systems and computer vision applications",
    audioUrl: "/audio/weekly-pulse-2.mp3",
    duration: 300,
    coverImage: "https://ui-avatars.com/api/?name=Vision+AI&background=8B5CF6&color=fff&format=svg"
  },
  {
    id: "wp3",
    title: "AI Regulation & Ethics",
    date: "Apr 1-7, 2025",
    summary: "New regulatory frameworks and ethical considerations for AI development",
    audioUrl: "/audio/weekly-pulse-3.mp3",
    duration: 300,
    coverImage: "https://ui-avatars.com/api/?name=AI+Ethics&background=A78BFA&color=fff&format=svg"
  },
  {
    id: "wp4",
    title: "LLMs & Reasoning Abilities",
    date: "Mar 25-31, 2025",
    summary: "Recent breakthroughs in LLM reasoning capabilities and chain-of-thought processes",
    audioUrl: "/audio/weekly-pulse-4.mp3",
    duration: 300,
    coverImage: "https://ui-avatars.com/api/?name=LLM+Reason&background=C4B5FD&color=fff&format=svg"
  }
];

// Monthly Round-Up - last 3 months
export const monthlyRoundupData: MonthlyRoundup[] = [
  {
    id: "mr1",
    title: "April 2025 Highlights",
    date: "Apr 2025",
    summary: "Major breakthroughs in AI agent development and regulatory responses",
    audioUrl: "/audio/monthly-roundup-1.mp3",
    duration: 600, // 10 minutes
    coverImage: "https://ui-avatars.com/api/?name=Apr+2025&background=0EA5E9&color=fff&format=svg"
  },
  {
    id: "mr2",
    title: "March 2025 Highlights",
    date: "Mar 2025",
    summary: "Advancements in multimodal LLMs and emergent capabilities",
    audioUrl: "/audio/monthly-roundup-2.mp3",
    duration: 600,
    coverImage: "https://ui-avatars.com/api/?name=Mar+2025&background=38BDF8&color=fff&format=svg"
  },
  {
    id: "mr3",
    title: "February 2025 Highlights",
    date: "Feb 2025",
    summary: "New paradigms in human-AI collaboration and coding assistants",
    audioUrl: "/audio/monthly-roundup-3.mp3",
    duration: 600,
    coverImage: "https://ui-avatars.com/api/?name=Feb+2025&background=7DD3FC&color=fff&format=svg"
  }
];

// Recent Updates - last 10 audibles added
export const recentUpdatesData: RecentUpdate[] = [
  {
    id: "ru1",
    title: "Transformer Architecture Deep Dive",
    date: "Apr 21, 2025",
    summary: "Comprehensive exploration of modern transformer architectures",
    audioUrl: "/audio/recent-update-1.mp3",
    duration: 480, // 8 minutes
    coverImage: "https://ui-avatars.com/api/?name=Transformers&background=4ADE80&color=fff&format=svg"
  },
  {
    id: "ru2",
    title: "AI Safety Practices",
    date: "Apr 20, 2025",
    summary: "Current best practices for AI system alignment and safety",
    audioUrl: "/audio/recent-update-2.mp3",
    duration: 420, // 7 minutes
    coverImage: "https://ui-avatars.com/api/?name=AI+Safety&background=86EFAC&color=fff&format=svg"
  },
  {
    id: "ru3",
    title: "Zero-shot & Few-shot Learning",
    date: "Apr 18, 2025",
    summary: "Techniques for training models that can learn with minimal examples",
    audioUrl: "/audio/recent-update-3.mp3",
    duration: 450, // 7.5 minutes
    coverImage: "https://ui-avatars.com/api/?name=Few+shot&background=A7F3D0&color=fff&format=svg"
  },
  {
    id: "ru4",
    title: "RLHF Explained",
    date: "Apr 17, 2025",
    summary: "The mechanics of Reinforcement Learning from Human Feedback",
    audioUrl: "/audio/recent-update-4.mp3",
    duration: 390, // 6.5 minutes
    coverImage: "https://ui-avatars.com/api/?name=RLHF&background=BEF264&color=fff&format=svg"
  },
  {
    id: "ru5",
    title: "LLM Inference Optimization",
    date: "Apr 15, 2025",
    summary: "Techniques to speed up inference and reduce cost of LLM deployments",
    audioUrl: "/audio/recent-update-5.mp3",
    duration: 360, // 6 minutes
    coverImage: "https://ui-avatars.com/api/?name=Inference&background=D9F99D&color=fff&format=svg"
  },
  {
    id: "ru6",
    title: "Multi-agent AI Systems",
    date: "Apr 14, 2025",
    summary: "Architectures for coordinating multiple specialized AI agents",
    audioUrl: "/audio/recent-update-6.mp3",
    duration: 420,
    coverImage: "https://ui-avatars.com/api/?name=Multi+Agent&background=F9A8D4&color=fff&format=svg"
  },
  {
    id: "ru7",
    title: "AI Governance Frameworks",
    date: "Apr 12, 2025",
    summary: "Emerging standards for AI system governance and oversight",
    audioUrl: "/audio/recent-update-7.mp3",
    duration: 480,
    coverImage: "https://ui-avatars.com/api/?name=Governance&background=FDA4AF&color=fff&format=svg"
  },
  {
    id: "ru8",
    title: "Vector Databases for AI",
    date: "Apr 10, 2025",
    summary: "How vector databases enable efficient semantic search and retrieval",
    audioUrl: "/audio/recent-update-8.mp3",
    duration: 330, // 5.5 minutes
    coverImage: "https://ui-avatars.com/api/?name=Vector+DB&background=FECDD3&color=fff&format=svg"
  },
  {
    id: "ru9",
    title: "Adversarial Attacks on LLMs",
    date: "Apr 8, 2025",
    summary: "Understanding and preventing prompt injection and jailbreaking",
    audioUrl: "/audio/recent-update-9.mp3",
    duration: 390,
    coverImage: "https://ui-avatars.com/api/?name=Adversarial&background=FED7AA&color=fff&format=svg"
  },
  {
    id: "ru10",
    title: "Frontier Model Capabilities",
    date: "Apr 6, 2025",
    summary: "Analysis of capabilities at the frontier of AI research",
    audioUrl: "/audio/recent-update-10.mp3",
    duration: 450,
    coverImage: "https://ui-avatars.com/api/?name=Frontier&background=FFEDD5&color=fff&format=svg"
  }
];

// Daily Flash - 5 most recent daily flashes
export const dailyFlashData: DailyFlash[] = [
  {
    id: "df1",
    title: "Google's New PaLM 4 Architecture",
    date: "Apr 21, 2025",
    summary: "Google unveils PaLM 4 with breakthrough performance on reasoning tasks",
    audioUrl: "/audio/daily-flash-1.mp3",
    duration: 120, // 2 minutes
    coverImage: "https://ui-avatars.com/api/?name=PaLM+4&background=DC2626&color=fff&format=svg"
  },
  {
    id: "df2",
    title: "Anthropic's Constitutional AI Framework",
    date: "Apr 20, 2025",
    summary: "Anthropic releases new framework for constitutional AI alignment",
    audioUrl: "/audio/daily-flash-2.mp3",
    duration: 120,
    coverImage: "https://ui-avatars.com/api/?name=Anthropic&background=EF4444&color=fff&format=svg"
  },
  {
    id: "df3",
    title: "EU AI Act Enforcement Begins",
    date: "Apr 19, 2025",
    summary: "European Union starts enforcement of comprehensive AI regulations",
    audioUrl: "/audio/daily-flash-3.mp3",
    duration: 120,
    coverImage: "https://ui-avatars.com/api/?name=EU+AI&background=F87171&color=fff&format=svg"
  },
  {
    id: "df4",
    title: "OpenAI's New Data Synthesis Method",
    date: "Apr 18, 2025",
    summary: "OpenAI publishes research on synthetic data generation with 70% less training data",
    audioUrl: "/audio/daily-flash-4.mp3",
    duration: 120,
    coverImage: "https://ui-avatars.com/api/?name=Data+Syn&background=FCA5A5&color=fff&format=svg"
  },
  {
    id: "df5",
    title: "Meta's Llama 4 Open Source Release",
    date: "Apr 17, 2025",
    summary: "Meta releases Llama 4 weights under new open research license",
    audioUrl: "/audio/daily-flash-5.mp3",
    duration: 120,
    coverImage: "https://ui-avatars.com/api/?name=Llama+4&background=FECACA&color=fff&format=svg"
  }
];
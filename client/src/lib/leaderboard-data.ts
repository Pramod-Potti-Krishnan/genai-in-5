export interface LeaderboardMetric {
  title: string;
  value: string | number;
  rank: number; // as percentage, e.g. top 12%
  icon: string;
  total?: number;
  current?: number;
}

export interface UserStats {
  progressRank: LeaderboardMetric;
  masteryScore: LeaderboardMetric;
  breadthIndex: LeaderboardMetric;
}

export const userStats: UserStats = {
  progressRank: {
    title: "Progress Rank",
    value: "Top 12%",
    rank: 12,
    icon: "🏅",
    current: 18,
    total: 50
  },
  masteryScore: {
    title: "Mastery Score",
    value: 4.2,
    rank: 20,
    icon: "⭐"
  },
  breadthIndex: {
    title: "Breadth Index",
    value: 7,
    rank: 15,
    icon: "📚"
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
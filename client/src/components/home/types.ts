export interface HomeAudible {
  id: number;            // Database uses serial (number) primary keys
  title: string;
  description: string;   // From database
  summary?: string;      // For client-side display
  durationInSeconds: number; // From database
  duration?: number;     // Alias for durationInSeconds for compatibility
  coverImage: string | null;
  audioUrl: string;
  sectionId: number;     // Database uses integer foreign keys
  createdAt?: Date | null;
}
export interface HomeAudible {
  id: string;
  title: string;
  summary: string;
  duration: number; // in seconds
  coverImage: string | null;
  audioUrl: string;
  sectionId: string;
}
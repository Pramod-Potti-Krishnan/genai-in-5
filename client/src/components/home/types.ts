export interface HomeAudible {
  id: string;
  title: string;
  summary: string;
  duration: number;
  coverImage?: string | null;
  audioUrl: string;
  sectionId: string;
}
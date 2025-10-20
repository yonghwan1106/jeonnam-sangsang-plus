export interface User {
  id: string;
  email: string;
  fullName?: string;
  department?: string;
  position?: string;
  interests?: string[];
}

export interface Idea {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  mode: 'general' | 'creative';
  probability?: number;
  keywords: string[];
  saved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PolicyCategory =
  | '인구감소대응'
  | '신산업육성'
  | '지역경제활성화'
  | '문화관광진흥'
  | '농축수산혁신';

export interface IdeaGenerationRequest {
  category: PolicyCategory;
  problemStatement: string;
  mode: 'general' | 'creative';
  creativityLevel?: number; // 1-20 for creative mode
}

export interface GeneratedIdea {
  title: string;
  content: string;
  keywords: string[];
  probability?: number;
}

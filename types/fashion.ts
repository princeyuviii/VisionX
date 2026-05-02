export interface RecommendationItem {
  id?: string;
  _id?: string;
  name: string;
  price: string;
  image: string;
  confidence: number;
  category: string;
}

export interface StyleRecommendation {
  id: number;
  style: string;
  match: number;
  description: string;
  matchDetails?: string;
  items: RecommendationItem[];
  colors: string[];
  gradient: string;
  skinTone: string;
  bodyType: string;
}

export interface FashionAnalysisResult {
  skinTone: string;
  bodyType: string;
  faceShape: string;
  measurements: any;
  colorPalette: string[];
  stylePreference: string;
  recommendations: StyleRecommendation[];
  mlServerStatus?: string;
  errors?: any;
}

export interface CommunityPost {
  id?: number;
  _id?: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    clerkId?: string;
  };
  image: string;
  caption: string;
  style: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface TrendingStyle {
  name: string;
  count: string;
  growth: string;
}

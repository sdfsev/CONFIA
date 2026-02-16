
export enum TrustLevel {
  VERIFIED = 'VERIFIED',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  ELITE = 'ELITE'
}

export interface Professional {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  avatar: string;
  trustLevel: TrustLevel;
  responseTime: string;
  online: boolean;
  about?: string;
  portfolio?: string[];
  tags?: string[];
  trustScore?: number;
  recommendationRate?: number;
}

export interface Notification {
  id: string;
  type: 'review' | 'verification' | 'system' | 'ranking';
  title: string;
  content: string;
  time: string;
  unread: boolean;
  rating?: number;
}

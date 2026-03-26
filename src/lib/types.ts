export interface NewsItem {
  id: string | number;
  date: string;
  category: string;
  title: string;
  link?: string;
  content?: string;
}

export interface Topic {
  id: string | number;
  title: string;
  description: string;
  iconName: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  titleEn?: string;
  description?: string;
  isPast: boolean;
}

export interface ConferenceInfo {
  title: string;
  subtitle: string;
  theme: string;
  themeEn: string;
  date: string;
  location: string;
  organizer: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
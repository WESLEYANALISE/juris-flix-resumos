
export interface LegalSubject {
  id: string;
  title: string;
  content: string;
  summary: string;
  isFavorite: boolean;
  lastViewed?: Date;
}

export interface LegalTheme {
  id: string;
  title: string;
  description: string;
  subjects: LegalSubject[];
}

export interface LegalArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  themes: LegalTheme[];
}

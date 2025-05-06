export interface Message {
  id: string;
  type: "user" | "text" | "question_cache" | "df" | "sql";
  question?: string;
  should_generate_chart?: boolean;
  text?: string;
  sql?: string;
  df?: string;
  fig?: string;
  summary?: string | null;
}

export interface IQuestion {
  id: string;
  question: string;
}

export interface Chat {
  id: string;
  messages: Message[];
}

export interface Prompt {
  id: number;
  title: string;
  description: string;
  category: string;
}

export interface IHistoryQuestion {
  questions: IQuestion[];
  type: string;
}

export interface IQuestion {
  id: string;
  question: string;
}

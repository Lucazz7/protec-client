export interface Message {
  id: string;
  type: string;
  message: string;
  timestamp: string;
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

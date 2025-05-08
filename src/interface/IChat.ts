export interface Message {
  id: string;
  response_type: string;
  is_correct?: boolean;
  question?: string;
  should_generate_chart?: boolean;
  text?: string;
  sql?: string;
  df?: string;
  fig?: string;
  summary?: string | null;
  error?: string | null;
  sql_error?: string | null;
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

export interface IResponseMessage {
  response_type: string;
  response: string;
  vanna_question: IVannaQuestion;
  answer: string;
}

export interface IVannaQuestion {
  question: string;
  vanna_collection_point: any;
  is_relevant: boolean;
  id: number;
  generated_sql: string;
}

export interface IAnswer {
  codfilial: number;
  codreqchave: number;
  codusucad: number;
  datahoracad: string;
  informacoes?: string;
  codusulib: number;
  datahoralib: string;
  codaprova: string;
  codtiporeq: number;
  parametros: any;
  parametros2: string;
  obs: string;
  datahoraalt: any;
  datahorareplica: any;
  justificativa: any;
  codfilialtrans: number;
  codtransacao: number;
  usuliberacao: any;
}

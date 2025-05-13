export interface IDataTrainingFiles {
  table_name: string;
  vanna_collection_point: string;
  origin_type: string;
  commented_ddl: string;
}

export interface IDataRelevantQuestions {
  id: number;
  question: string;
  generated_sql: string;
  vanna_collection_point: string;
  is_relevant: boolean;
}

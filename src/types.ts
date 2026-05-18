export type QuizQuestion = {
  direct: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type AnalysisRegion = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

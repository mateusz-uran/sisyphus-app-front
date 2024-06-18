export interface WorkGroup {
  id: string;
  cvData: string;
  cvFileName: string;
  creationTime: string;
  applied: number;
  denied: number;
  inProgress: number;
}

export interface TransformedWorkGroup {
  id: string;
  cvData: Blob;
  cvFileName: string;
  creationTime: string;
  applied: number;
  denied: number;
  inProgress: number;
}

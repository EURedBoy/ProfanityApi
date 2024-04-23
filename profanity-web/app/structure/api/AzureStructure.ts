export interface AzureResponse {
  object: string;
  data: AzureData[];
  model: string;
}

export interface AzureData {
  object: string;
  index: number;
  embedding: number[];
}

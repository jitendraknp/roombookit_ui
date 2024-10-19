export interface ApiResponse {
  Message: string;
  Status: number;
  StatusCode: number;
  Data: any;
}

export interface PagedResponse {
  Message: string;
  Status: number;
  StatusCode: number;
  Data: any;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
  TotalRecords: number;
}

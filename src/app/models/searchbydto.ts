export interface SearchByDTO {
  TextToSearch: string;
  FieldId: number;
  PageNumber: number;
  PageSize: number;

}

export interface SearchResponse {
  Id: string;
  SearchResult: string;
}

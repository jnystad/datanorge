export interface Distribution {
  description: string;
  format: string | string[];
  accessURL?: string[];
  downloadURL?: string[];
}

export interface Dataset {
  id: string;
  entryUri: string;
  title: string;
  description: string;
  uri: string;
  publisher: string;
  keyword: string[];
  distribution?: Distribution[];
}

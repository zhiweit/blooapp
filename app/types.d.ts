interface WasteType {
  material: string;
  item: string;
  recyclable: boolean;
  instructions: string;
  links?: string[];
}

interface ApiVisionResponse {
  from_database: WasteType[];
  from_llm: WasteType[];
}

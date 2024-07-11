interface WasteType {
  material: string;
  item: string;
  recyclable: boolean;
  instructions: string;
  links?: string[];
  source: "database" | "llm";
}

interface ApiVisionResponse {
  data: WasteType[];
}

interface ImageSearchAccordionDataItem extends WasteType {
  feedback: 0 | 1 | 2; // 0 - No feedback | 1 - Helpful response | 2 - Not helpful response
}

interface ImageSearchAccordionData {
  feedbackId: string;
  imageUrl: string;
  items: ImageSearchAccordionDataItem[];
}

interface WasteTypeFeedback {
  feedbackId: string; // id of document storing the feedback for the items
  imageUrl?: string;
  items?: WasteTypeFeedbackItem[];
}

interface WasteTypeFeedbackItem {
  item: string;
  source: "database" | "llm";
  feedback: 0 | 1 | 2; // 0 - No feedback | 1 - Helpful response | 2 - Not helpful response
}

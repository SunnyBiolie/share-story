export interface FormatType {
  bold: boolean;
  underline: boolean;
  italic: boolean;
  strikeThrough: boolean;
}

export interface TextItemType {
  id: string;
  type: "text";
  content: string;
  format: FormatType;
  fontStyle: "h1" | "h2" | "h3" | "p";
}

export interface CheckboxItemType {
  id: string;
  type: "checkbox";
  content: string;
  checked: boolean;
}

export type AspectRatio = "auto" | "1/1" | "4/3" | "3/2" | "16/9";

export const AspectRatioValue = {
  auto: null,
  "1/1": 1 / 1,
  "4/3": 4 / 3,
  "3/2": 3 / 2,
  "16/9": 16 / 9,
};

export interface ImageItemType {
  id: string;
  type: "image";
  content: string;
  caption?: string;
  aspectRatio: AspectRatio;
  percentageWidth: string;
  cropPos: [number, number];
}

export interface BlankItemType {
  id: string;
  type: "blank";
}

export interface DataType {
  currentIndex: number;
  blockContent: (
    | BlankItemType
    | TextItemType
    | CheckboxItemType
    | ImageItemType
  )[];
}

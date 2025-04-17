
export interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  fields: FormField[];
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[]; // Used for select type
  value?: string; // Current value
  rect?: { x: number, y: number, width: number, height: number }; // Position in document
  page?: number; // Page number in document
}

export interface DocumentInfo {
  id: string;
  name: string;
  url: string;
  templateId?: string;
  fields: FormField[];
}

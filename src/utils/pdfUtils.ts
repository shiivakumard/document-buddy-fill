
import { FormField, DocumentInfo } from "@/types";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
const pdfjsWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

/**
 * Extract placeholders from text content using regex ({{placeholder}})
 */
const extractPlaceholders = (text: string): string[] => {
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  const matches = [...text.matchAll(placeholderRegex)];
  
  // Extract the placeholder names (without {{ }})
  const placeholders = matches.map(match => match[1].trim());
  
  // Remove duplicates
  return [...new Set(placeholders)];
};

/**
 * Extract form fields from a PDF document
 */
export const extractFormFields = async (file: File): Promise<FormField[]> => {
  console.log("Extracting form fields from:", file.name);
  
  try {
    // Create a URL for the PDF file
    const fileUrl = URL.createObjectURL(file);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    
    const numPages = pdf.numPages;
    const placeholders: string[] = [];
    
    // Extract text content from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Join all text items
      const textItems = textContent.items.map((item: any) => item.str).join(' ');
      
      // Extract placeholders from this page
      const pagePlaceholders = extractPlaceholders(textItems);
      placeholders.push(...pagePlaceholders);
    }
    
    // Remove duplicates
    const uniquePlaceholders = [...new Set(placeholders)];
    
    // Create form fields for each placeholder
    const fields: FormField[] = uniquePlaceholders.map((placeholder, index) => ({
      id: `field_${index + 1}`,
      name: placeholder,
      type: "text",
      placeholder: `Enter ${placeholder}`,
      required: true,
      rect: { x: 100, y: 100 + index * 50, width: 300, height: 30 },
      page: 1
    }));
    
    // Cleanup
    URL.revokeObjectURL(fileUrl);
    
    return fields.length > 0 ? fields : createDefaultFields();
  } catch (error) {
    console.error("Error extracting placeholders:", error);
    // Return some default fields if extraction fails
    return createDefaultFields();
  }
};

/**
 * Create default fields if no placeholders are found
 */
const createDefaultFields = (): FormField[] => {
  return [
    {
      id: "field_1",
      name: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
      rect: { x: 100, y: 200, width: 300, height: 30 },
      page: 1
    },
    {
      id: "field_2",
      name: "Email",
      type: "text",
      placeholder: "Enter your email",
      required: true,
      rect: { x: 100, y: 250, width: 300, height: 30 },
      page: 1
    }
  ];
};

/**
 * Create a URL for displaying a PDF
 */
export const createPdfPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Place a field on the document (simulate creating a field at a specific location)
 */
export const createFieldAtPosition = (
  x: number, 
  y: number, 
  page: number = 1, 
  fieldName: string = "New Field"
): FormField => {
  return {
    id: `field_${Date.now()}`,
    name: fieldName,
    type: "text",
    placeholder: `Enter ${fieldName.toLowerCase()}`,
    required: false,
    rect: { x, y, width: 200, height: 30 },
    page
  };
};

/**
 * Fill PDF with values and generate a new PDF with filled placeholders
 */
export const fillPdfWithValues = async (documentUrl: string, fields: FormField[]): Promise<string> => {
  console.log("Filling PDF with values:", fields.map(f => `${f.name}: ${f.value}`).join(", "));
  
  try {
    // In a real implementation:
    // 1. Load the PDF
    // 2. Find placeholders in the content
    // 3. Replace placeholders with values
    // 4. Generate a new PDF

    // For now, we'll simulate success after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would return a URL to the filled PDF
    return documentUrl;
  } catch (error) {
    console.error("Error filling PDF:", error);
    throw new Error("Failed to fill PDF with values");
  }
};


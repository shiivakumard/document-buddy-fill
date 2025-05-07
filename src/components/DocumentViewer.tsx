
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FormField, DocumentInfo } from "@/types";
import { Upload, AlertCircle, FileText } from "lucide-react";
import { extractFormFields, createPdfPreviewUrl, createFieldAtPosition } from "@/utils/pdfUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentViewerProps {
  selectedField?: FormField;
  onDocumentLoaded: (documentInfo: DocumentInfo) => void;
  onFieldsExtracted: (fields: FormField[]) => void;
  onAddField?: (field: FormField) => void;
  isAddingField?: boolean;
  newFieldName?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  selectedField,
  onDocumentLoaded,
  onFieldsExtracted,
  onAddField,
  isAddingField,
  newFieldName,
}) => {
  const { toast } = useToast();
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (!file.type.includes('pdf')) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please upload a PDF document"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create PDF preview URL
      const url = await createPdfPreviewUrl(file);
      
      toast({
        title: "Processing document",
        description: "Extracting placeholders from PDF..."
      });
      
      // Extract form fields and placeholders
      const fields = await extractFormFields(file);
      
      const docInfo: DocumentInfo = {
        id: `doc_${Date.now()}`,
        name: file.name,
        url,
        fields
      };
      
      setDocument(docInfo);
      onDocumentLoaded(docInfo);
      onFieldsExtracted(fields);
      
      toast({
        title: "Document uploaded",
        description: `Successfully extracted ${fields.length} placeholder${fields.length === 1 ? '' : 's'}`
      });
    } catch (err) {
      console.error("Error processing document:", err);
      setError("Failed to process the document. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the document"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingField || !document || !newFieldName) return;

    // Get the container's position
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate click position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For simplicity, assuming page 1 (in a real app, you'd determine current page)
    const page = 1;
    
    // Create a new field at the clicked position
    const newField = createFieldAtPosition(x, y, page, newFieldName);
    
    // Notify parent component
    onAddField?.(newField);
    
    toast({
      title: "Field added",
      description: `Added "${newFieldName}" field to the document`
    });
  };

  return (
    <div className="flex flex-col h-full">
      {!document ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload your document</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Supported format: PDF with placeholders like {{name}}
          </p>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
            <Button 
              variant="outline" 
              className="flex items-center"
              disabled={isLoading}
              onClick={() => {}}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? "Processing..." : "Select PDF"}
              </span>
            </Button>
          </label>
        </div>
      ) : (
        <div 
          className={`relative flex-1 border rounded-lg overflow-hidden bg-white ${isAddingField ? 'cursor-crosshair' : ''}`}
          onClick={handleDocumentClick}
        >
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isAddingField && (
            <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white py-2 px-4 text-center">
              Click on the document where you want to place the field: {newFieldName}
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={document.url}
            title={document.name}
            className="w-full h-full"
            style={{ minHeight: "500px", pointerEvents: isAddingField ? 'none' : 'auto' }}
          />
          
          {selectedField && (
            <div 
              className="absolute border-2 border-blue-500 bg-blue-100/30 animate-pulse pointer-events-none"
              style={{
                left: `${selectedField.rect?.x}px`,
                top: `${selectedField.rect?.y}px`,
                width: `${selectedField.rect?.width}px`,
                height: `${selectedField.rect?.height}px`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;

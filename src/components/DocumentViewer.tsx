
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FormField, DocumentInfo } from "@/types";
import { Upload, AlertCircle, FileText } from "lucide-react";
import { extractFormFields, createPdfPreviewUrl } from "@/utils/pdfUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentViewerProps {
  selectedField?: FormField;
  onDocumentLoaded: (documentInfo: DocumentInfo) => void;
  onFieldsExtracted: (fields: FormField[]) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  selectedField,
  onDocumentLoaded,
  onFieldsExtracted
}) => {
  const { toast } = useToast();
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      // Extract form fields
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
        description: `Successfully processed ${file.name}`
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

  return (
    <div className="flex flex-col h-full">
      {!document ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload your document</h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Supported format: PDF
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
        <div className="relative flex-1 border rounded-lg overflow-hidden bg-white">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <iframe
            src={document.url}
            title={document.name}
            className="w-full h-full"
            style={{ minHeight: "500px" }}
          />
          
          {selectedField && (
            <div 
              className="absolute border-2 border-document-highlight animate-field-highlight pointer-events-none"
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


import React, { useState } from "react";
import { Template, FormField, DocumentInfo } from "@/types";
import TemplateCreator from "@/components/TemplateCreator";
import TemplateSelector from "@/components/TemplateSelector";
import DocumentViewer from "@/components/DocumentViewer";
import FormFieldsSidebar from "@/components/FormFieldsSidebar";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fillPdfWithValues } from "@/utils/pdfUtils";

enum AppView {
  TemplateSelection,
  TemplateCreation,
  DocumentFilling
}

const Index = () => {
  const { toast } = useToast();
  const [view, setView] = useState<AppView>(AppView.TemplateSelection);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [currentDocument, setCurrentDocument] = useState<DocumentInfo | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const handleCreateTemplate = (template: Template) => {
    setTemplates([...templates, template]);
    setView(AppView.TemplateSelection);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormFields(template.fields);
    setView(AppView.DocumentFilling);
  };

  const handleDocumentLoaded = (document: DocumentInfo) => {
    setCurrentDocument(document);
    
    // If we have a selected template, use its fields
    if (selectedTemplate) {
      document.templateId = selectedTemplate.id;
    }
  };

  const handleFieldsExtracted = (fields: FormField[]) => {
    // If we have a template, merge its fields with extracted fields
    if (selectedTemplate) {
      const allFields = [...selectedTemplate.fields, ...fields];
      // Remove duplicates based on field names
      const uniqueFields = allFields.filter((field, index, self) => 
        index === self.findIndex(f => f.name === field.name)
      );
      setFormFields(uniqueFields);
    } else {
      setFormFields(fields);
    }
  };

  const handleSelectField = (fieldId: string) => {
    setSelectedFieldId(fieldId);
  };

  const handleUpdateFieldValue = (fieldId: string, value: string) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };
  
  const handleAddField = (fieldName: string) => {
    setIsAddingField(true);
    setNewFieldName(fieldName);
  };
  
  const handleFieldAdded = (newField: FormField) => {
    setFormFields([...formFields, newField]);
    setIsAddingField(false);
    setNewFieldName("");
  };
  
  const handleSaveDocument = async () => {
    if (!currentDocument) return;
    
    toast({
      title: "Processing document",
      description: "Please wait while we process your document"
    });
    
    try {
      // In a real app, this would actually fill the PDF with values
      const filledPdfUrl = await fillPdfWithValues(currentDocument.url, formFields);
      
      toast({
        title: "Document ready",
        description: "Your document has been filled successfully"
      });
      
      // In a real app, you might offer a download link or preview the filled document
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the document"
      });
    }
  };

  const renderView = () => {
    switch (view) {
      case AppView.TemplateCreation:
        return (
          <TemplateCreator
            onCreateTemplate={handleCreateTemplate}
            onCancel={() => setView(AppView.TemplateSelection)}
          />
        );
      
      case AppView.DocumentFilling:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
            <div className="lg:col-span-2 flex flex-col">
              <DocumentViewer 
                selectedField={formFields.find(field => field.id === selectedFieldId)}
                onDocumentLoaded={handleDocumentLoaded}
                onFieldsExtracted={handleFieldsExtracted}
                onAddField={handleFieldAdded}
                isAddingField={isAddingField}
                newFieldName={newFieldName}
              />
            </div>
            <div className="bg-white border rounded-lg overflow-hidden">
              <FormFieldsSidebar
                fields={formFields}
                selectedFieldId={selectedFieldId}
                onSelectField={handleSelectField}
                onUpdateFieldValue={handleUpdateFieldValue}
                onAddField={handleAddField}
                onSaveDocument={handleSaveDocument}
              />
            </div>
          </div>
        );
        
      default: // Template Selection
        return (
          <TemplateSelector
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={() => setView(AppView.TemplateCreation)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Document Buddy Fill</h1>
            </div>
            
            {view === AppView.DocumentFilling && (
              <Button
                variant="outline"
                onClick={() => setView(AppView.TemplateSelection)}
              >
                Back to Templates
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;

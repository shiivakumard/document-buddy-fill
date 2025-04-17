
import React, { useState } from "react";
import { Template, FormField, DocumentInfo } from "@/types";
import TemplateCreator from "@/components/TemplateCreator";
import TemplateSelector from "@/components/TemplateSelector";
import DocumentViewer from "@/components/DocumentViewer";
import FormFieldsSidebar from "@/components/FormFieldsSidebar";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

enum AppView {
  TemplateSelection,
  TemplateCreation,
  DocumentFilling
}

const Index = () => {
  const [view, setView] = useState<AppView>(AppView.TemplateSelection);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [currentDocument, setCurrentDocument] = useState<DocumentInfo | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const handleCreateTemplate = (template: Template) => {
    setTemplates([...templates, template]);
    setView(AppView.TemplateSelection);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setView(AppView.DocumentFilling);
  };

  const handleDocumentLoaded = (document: DocumentInfo) => {
    setCurrentDocument(document);
  };

  const handleFieldsExtracted = (fields: FormField[]) => {
    setFormFields(fields);
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
              />
            </div>
            <div className="bg-white border rounded-lg overflow-hidden">
              <FormFieldsSidebar
                fields={formFields}
                selectedFieldId={selectedFieldId}
                onSelectField={handleSelectField}
                onUpdateFieldValue={handleUpdateFieldValue}
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

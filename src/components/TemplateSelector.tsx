
import React from "react";
import { Button } from "@/components/ui/button";
import { Template } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Plus } from "lucide-react";

interface TemplateSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onCreateNew: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelectTemplate,
  onCreateNew
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Select a Template</h2>
        <Button onClick={onCreateNew} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No templates yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Create your first template to get started
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{template.name}</span>
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {template.description || "No description available"}
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  Created on {formatDate(template.createdAt)}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {template.fields.length} form {template.fields.length === 1 ? 'field' : 'fields'}
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Button 
                  onClick={() => onSelectTemplate(template)} 
                  variant="outline" 
                  className="w-full"
                >
                  Select Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;

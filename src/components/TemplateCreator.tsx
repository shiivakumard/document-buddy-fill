
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Save } from "lucide-react";
import { Template, FormField } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface TemplateCreatorProps {
  onCreateTemplate: (template: Template) => void;
  onCancel: () => void;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ 
  onCreateTemplate, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  
  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: `Field ${fields.length + 1}`,
      type: "text",
      placeholder: "",
      required: false
    };
    
    setFields([...fields, newField]);
  };
  
  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };
  
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }
    
    if (fields.length === 0) {
      toast({
        title: "No fields added",
        description: "Please add at least one form field to your template",
        variant: "destructive"
      });
      return;
    }
    
    const newTemplate: Template = {
      id: `template_${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      fields
    };
    
    onCreateTemplate(newTemplate);
    toast({
      title: "Template created",
      description: `Template '${name}' has been created successfully`
    });
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Create New Template
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Template Name</label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Form Fields</h3>
              <Button 
                type="button" 
                onClick={addField}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Field
              </Button>
            </div>
            
            {fields.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No fields added yet</p>
                <Button 
                  type="button" 
                  onClick={addField}
                  size="sm"
                  variant="outline"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Field
                </Button>
              </div>
            )}
            
            {fields.map((field) => (
              <Card key={field.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`field-name-${field.id}`} className="text-sm font-medium">Field Name</label>
                      <Input 
                        id={`field-name-${field.id}`}
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`field-type-${field.id}`} className="text-sm font-medium">Field Type</label>
                      <select 
                        id={`field-type-${field.id}`}
                        value={field.type}
                        onChange={(e) => updateField(field.id, { 
                          type: e.target.value as 'text' | 'number' | 'date' | 'select' 
                        })}
                        className="w-full mt-1 border rounded-md px-3 py-2"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="select">Select</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor={`field-placeholder-${field.id}`} className="text-sm font-medium">Placeholder</label>
                      <Input 
                        id={`field-placeholder-${field.id}`}
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id={`field-required-${field.id}`}
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      />
                      <label htmlFor={`field-required-${field.id}`} className="text-sm">
                        Required Field
                      </label>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeField(field.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TemplateCreator;

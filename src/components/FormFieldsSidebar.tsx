
import React from "react";
import { FormField } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, AlertCircle } from "lucide-react";

interface FormFieldsSidebarProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onUpdateFieldValue: (fieldId: string, value: string) => void;
}

const FormFieldsSidebar: React.FC<FormFieldsSidebarProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateFieldValue
}) => {
  if (fields.length === 0) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
        <h3 className="font-medium">No form fields detected</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a document with form fields to get started
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-medium">Document Fields</h3>
      
      <div className="space-y-4">
        {fields.map((field) => {
          const isSelected = selectedFieldId === field.id;
          
          return (
            <div key={field.id} className={`border rounded-md p-3 
              ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
              ${field.value ? 'bg-gray-50' : ''}
              transition-all`}
            >
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor={field.id} className="font-medium">
                  {field.name}
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSelectField(field.id)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
              
              {field.type === 'date' ? (
                <Input
                  id={field.id}
                  type="date"
                  value={field.value || ''}
                  onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  id={field.id}
                  value={field.value || ''}
                  onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select an option</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={field.value || ''}
                  onChange={(e) => onUpdateFieldValue(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              )}
              
              {field.required && !field.value && (
                <p className="text-xs text-red-500 mt-1">Required field</p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t">
        <Button className="w-full flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Document
        </Button>
      </div>
    </div>
  );
};

export default FormFieldsSidebar;

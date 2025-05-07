
import React, { useState } from "react";
import { FormField } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, AlertCircle, Bookmark, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FormFieldsSidebarProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onUpdateFieldValue: (fieldId: string, value: string) => void;
  onAddField?: (fieldName: string) => void;
  onSaveDocument?: () => void;
}

const FormFieldsSidebar: React.FC<FormFieldsSidebarProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateFieldValue,
  onAddField,
  onSaveDocument
}) => {
  const { toast } = useToast();
  const [newFieldName, setNewFieldName] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const handleAddField = () => {
    if (!newFieldName.trim()) {
      toast({
        title: "Field name required",
        description: "Please enter a name for the new field",
        variant: "destructive"
      });
      return;
    }

    onAddField?.(newFieldName);
    setNewFieldName("");
    setShowAddField(false);
    
    toast({
      title: "Field added",
      description: "Click on the document where you want to place this field"
    });
  };

  const handleSaveDocument = () => {
    // Check if all required fields are filled
    const unfilled = fields.filter(field => field.required && !field.value);
    
    if (unfilled.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill ${unfilled.length} required field(s)`,
        variant: "destructive"
      });
      return;
    }
    
    onSaveDocument?.();
  };

  if (fields.length === 0) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
        <h3 className="font-medium">No placeholders detected</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a document with placeholders like {{name}} to get started
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document Fields</h3>
        {onAddField && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddField(!showAddField)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
        )}
      </div>
      
      {showAddField && (
        <div className="border rounded-lg p-3 bg-muted/20">
          <Label htmlFor="new-field-name">New Field Name</Label>
          <div className="flex mt-1 space-x-2">
            <Input
              id="new-field-name"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Enter field name"
            />
            <Button onClick={handleAddField} size="sm">Add</Button>
          </div>
        </div>
      )}
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {fields.map((field) => {
          const isSelected = selectedFieldId === field.id;
          const isFilled = !!field.value;
          const isPlaceholder = field.name.includes("{{") || field.name.includes("}}");
          
          // Clean up placeholder name for display
          const displayName = field.name.replace(/[{}]/g, '').trim();
          
          return (
            <div 
              key={field.id} 
              className={`border rounded-md p-3 
                ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
                ${isFilled ? 'bg-gray-50' : ''}
                transition-all hover:bg-gray-50 cursor-pointer`}
              onClick={() => onSelectField(field.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Bookmark className={`h-4 w-4 mr-2 ${isFilled ? 'text-green-500' : 'text-gray-400'}`} />
                  <Label htmlFor={field.id} className="font-medium cursor-pointer">
                    {displayName} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
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
                  placeholder={field.placeholder || `Enter ${displayName.toLowerCase()}`}
                  className="w-full"
                />
              )}
              
              {field.required && !field.value && (
                <p className="text-xs text-red-500 mt-1">Required field</p>
              )}
              
              {field.page && (
                <p className="text-xs text-gray-500 mt-1">Page {field.page}</p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t">
        <Button 
          className="w-full flex items-center"
          onClick={handleSaveDocument}
        >
          <Save className="mr-2 h-4 w-4" />
          Fill Document
        </Button>
      </div>
    </div>
  );
};

export default FormFieldsSidebar;

/**
 * FormFieldEditor Component
 * 
 * This component provides an interface for managing form field values of a specific type.
 * It allows administrators to:
 * - View existing field values
 * - Add new field values
 * - Edit existing field values
 * - Delete field values
 * 
 * It uses the useFormFields hook to interact with Firebase.
 */

import React, { useState } from 'react';
import { useFormFields } from '../../hooks/useFormFields';
import { FormFieldValue } from '../../services/FormFieldsService';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Alert from '../ui/alert/Alert';

interface FormFieldEditorProps {
  fieldType: string; // The type of field to edit (e.g., 'contactRoles')
}

/**
 * FormFieldEditor component for managing form field values
 */
const FormFieldEditor: React.FC<FormFieldEditorProps> = ({ fieldType }) => {
  const { 
    fieldValues, 
    loading, 
    error, 
    submitting, 
    submitError,
    addFieldValue,
    updateFieldValue,
    deleteFieldValue
  } = useFormFields(fieldType);
  
  // Form state
  const [newValue, setNewValue] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editLabel, setEditLabel] = useState<string>('');
  
  /**
   * Handle adding a new field value
   */
  const handleAddValue = async () => {
    if (!newValue.trim() || !newLabel.trim()) return;
    
    // Check if value already exists
    const exists = fieldValues.some(field => 
      field.value === newValue || field.label === newLabel
    );
    
    if (exists) {
      alert('This value or label already exists');
      return;
    }
    
    // Add new value
    await addFieldValue(fieldType, {
      value: newValue,
      label: newLabel,
      isDefault: false
    });
    
    // Clear inputs
    setNewValue('');
    setNewLabel('');
  };
  
  /**
   * Handle editing a field value
   */
  const handleEditValue = async (index: number) => {
    if (!editValue.trim() || !editLabel.trim()) return;
    
    const oldValue = fieldValues[index];
    const newValue: FormFieldValue = {
      ...oldValue,
      value: editValue,
      label: editLabel
    };
    
    // Update value
    await updateFieldValue(fieldType, oldValue, newValue);
    
    // Clear editing state
    setEditingIndex(null);
    setEditValue('');
    setEditLabel('');
  };
  
  /**
   * Handle deleting a field value
   */
  const handleDeleteValue = async (value: FormFieldValue) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${value.label}"?`)) {
      return;
    }
    
    // Don't allow deleting default values
    if (value.isDefault) {
      alert('Cannot delete default values');
      return;
    }
    
    // Delete value
    await deleteFieldValue(fieldType, value);
  };
  
  /**
   * Start editing a value
   */
  const startEditing = (index: number) => {
    const value = fieldValues[index];
    setEditingIndex(index);
    setEditValue(value.value);
    setEditLabel(value.label);
  };
  
  /**
   * Cancel editing
   */
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
    setEditLabel('');
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Alert 
        variant="error" 
        title="Error!" 
        message={error.message || `Failed to load ${fieldType} values`} 
      />
    );
  }
  
  return (
    <div>
      {submitError && (
        <div className="mb-6">
          <Alert 
            variant="error" 
            title="Error!" 
            message={submitError.message || 'An error occurred'} 
          />
        </div>
      )}
      
      {/* Add new value form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">
          Add New {fieldType === 'contactRoles' ? 'Role' : 
                   fieldType === 'contactStatuses' ? 'Status' : 'Industry'}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor={`new-value-${fieldType}`}>Value</Label>
            <Input
              type="text"
              id={`new-value-${fieldType}`}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter value (e.g., 'manager')"
            />
          </div>
          
          <div>
            <Label htmlFor={`new-label-${fieldType}`}>Label</Label>
            <Input
              type="text"
              id={`new-label-${fieldType}`}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Enter label (e.g., 'Manager')"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            onClick={handleAddValue}
            disabled={submitting || !newValue.trim() || !newLabel.trim()}
            variant="primary"
          >
            {submitting ? 'Adding...' : 'Add Value'}
          </Button>
        </div>
      </div>
      
      {/* Values list */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Label</th>
              <th className="px-6 py-3">Default</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fieldValues.map((field, index) => (
              <tr 
                key={field.value} 
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {editingIndex === index ? (
                  // Edit mode
                  <>
                    <td className="px-6 py-4">
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {field.isDefault ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditValue(index)}
                          disabled={submitting || !editValue.trim() || !editLabel.trim()}
                          variant="primary"
                          className="px-2 py-1 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td className="px-6 py-4">{field.value}</td>
                    <td className="px-6 py-4">{field.label}</td>
                    <td className="px-6 py-4">
                      {field.isDefault ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startEditing(index)}
                          disabled={submitting || field.isDefault}
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteValue(field)}
                          disabled={submitting || field.isDefault}
                          variant="danger"
                          className="px-2 py-1 text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            
            {fieldValues.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  No values found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormFieldEditor;
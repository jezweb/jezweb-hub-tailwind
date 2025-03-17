/**
 * QuoteForm Component
 * 
 * This component provides a form for creating and editing quotes.
 * It handles form validation, submission, and dynamic quote item management.
 */
import React, { useState, useEffect } from 'react';
import { Quote, QuoteFormData, QuoteItem, QuoteStatus } from '../../../types/Quote';
import { formatDate, formatDateToYYYYMMDD } from '../../../utils/formatters';

interface QuoteFormProps {
  quote?: Quote;
  isSubmitting: boolean;
  onSubmit: (data: QuoteFormData) => void;
  onCancel: () => void;
}

/**
 * QuoteForm component
 */
const QuoteForm: React.FC<QuoteFormProps> = ({
  quote,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  // Form state
  const [formData, setFormData] = useState<QuoteFormData>({
    subject: '',
    quoteDate: formatDateToYYYYMMDD(new Date().toISOString()),
    expiryDate: formatDateToYYYYMMDD(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()), // 14 days from now
    status: QuoteStatus.DRAFT,
    items: [
      {
        itemId: `item_${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with quote data if editing
  useEffect(() => {
    if (quote) {
      setFormData({
        subject: quote.subject,
        quoteDate: formatDateToYYYYMMDD(quote.quoteDate),
        expiryDate: formatDateToYYYYMMDD(quote.expiryDate),
        status: quote.status,
        items: quote.items.map(item => ({
          ...item
        })),
        subtotal: quote.subtotal,
        tax: quote.tax,
        total: quote.total,
        notes: quote.notes || ''
      });
    }
  }, [quote]);
  
  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax, rounded to 2 decimal places
    const total = subtotal + tax;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [formData.items]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle item change
  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updatedItems = [...formData.items];
    
    // Update the specific field
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate amount if quantity or unitPrice changed
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : updatedItems[index].unitPrice;
      updatedItems[index].amount = Math.round(quantity * unitPrice * 100) / 100; // Round to 2 decimal places
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Clear item errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`items[${index}].description`];
      delete newErrors[`items[${index}].quantity`];
      delete newErrors[`items[${index}].unitPrice`];
      return newErrors;
    });
  };
  
  // Add new item
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: `item_${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ]
    }));
  };
  
  // Remove item
  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Clear item errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`items[${index}].description`];
      delete newErrors[`items[${index}].quantity`];
      delete newErrors[`items[${index}].unitPrice`];
      return newErrors;
    });
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.quoteDate) {
      newErrors.quoteDate = 'Quote date is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date(formData.quoteDate)) {
      newErrors.expiryDate = 'Expiry date must be after quote date';
    }
    
    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`items[${index}].description`] = 'Description is required';
      }
      
      if (item.quantity <= 0) {
        newErrors[`items[${index}].quantity`] = 'Quantity must be greater than 0';
      }
      
      if (item.unitPrice < 0) {
        newErrors[`items[${index}].unitPrice`] = 'Unit price cannot be negative';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Quote Information */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Quote Information</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Subject */}
          <div className="col-span-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.subject ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
              placeholder="e.g., Website Redesign Proposal"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
            )}
          </div>
          
          {/* Quote Date */}
          <div>
            <label htmlFor="quoteDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quote Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="quoteDate"
              name="quoteDate"
              value={formData.quoteDate}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.quoteDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
            {errors.quoteDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quoteDate}</p>
            )}
          </div>
          
          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.expiryDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              aria-label="Select quote status"
            >
              <option value={QuoteStatus.DRAFT}>Draft</option>
              <option value={QuoteStatus.SENT}>Sent</option>
              <option value={QuoteStatus.ACCEPTED}>Accepted</option>
              <option value={QuoteStatus.REJECTED}>Rejected</option>
              <option value={QuoteStatus.EXPIRED}>Expired</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Quote Items */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quote Items</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Item
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Unit Price
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Amount
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {formData.items.map((item, index) => (
                <tr key={item.itemId}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`block w-full rounded-md border ${
                        errors[`items[${index}].description`] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      } bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                      placeholder="Item description"
                    />
                    {errors[`items[${index}].description`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`items[${index}].description`]}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      aria-label="Item quantity"
                      title="Item quantity"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className={`block w-full rounded-md border ${
                        errors[`items[${index}].quantity`] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      } bg-white px-3 py-2 text-right shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors[`items[${index}].quantity`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`items[${index}].quantity`]}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      aria-label="Item unit price"
                      title="Item unit price"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                      className={`block w-full rounded-md border ${
                        errors[`items[${index}].unitPrice`] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      } bg-white px-3 py-2 text-right shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                    />
                    {errors[`items[${index}].unitPrice`] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`items[${index}].unitPrice`]}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label="Remove item"
                      title="Remove item"
                      onClick={() => handleRemoveItem(index)}
                      disabled={formData.items.length <= 1}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <td colSpan={2} className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Subtotal:</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">${formData.subtotal.toFixed(2)}</td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td colSpan={2} className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Tax (10%):</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">${formData.tax.toFixed(2)}</td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td colSpan={2} className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Total:</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">${formData.total.toFixed(2)}</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Notes */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Notes</h3>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Payment terms, delivery details, etc."
          ></textarea>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Quote'
          )}
        </button>
      </div>
    </form>
  );
};

export default QuoteForm;
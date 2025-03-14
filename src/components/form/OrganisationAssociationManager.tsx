/**
 * OrganisationAssociationManager Component
 * 
 * This component manages the many-to-many relationship between contacts and organisations.
 * It allows users to add, edit, and remove organisation associations with specific roles.
 * 
 * The component is designed to be used in contact forms to handle multiple organisation
 * associations in a user-friendly way.
 */

import React, { useState, useEffect } from 'react';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import AutocompleteSelect from './AutocompleteSelect';
import { ContactRole } from '../../types/Contact';

// Interface for organisation association
interface OrganisationAssociation {
  id?: string;
  organisationId: string;
  organisationName: string;
  jobTitle?: string;
  role?: string;
}

interface OrganisationAssociationManagerProps {
  contactId?: string;
  initialAssociations?: OrganisationAssociation[];
  onChange: (associations: OrganisationAssociation[]) => void;
  className?: string;
}

const OrganisationAssociationManager: React.FC<OrganisationAssociationManagerProps> = ({
  contactId,
  initialAssociations = [],
  onChange,
  className = ''
}) => {
  // State for associations
  const [associations, setAssociations] = useState<OrganisationAssociation[]>(initialAssociations);
  
  // State for new association form
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<string>('');
  const [selectedOrganisationName, setSelectedOrganisationName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [role, setRole] = useState<string>('staff');
  
  // Get organisations data from the hook
  const {
    organisations,
    loading: loadingOrganisations,
    fetchOrganisations
  } = useOrganisations();
  
  // Fetch organisations when component mounts
  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);
  
  // Update parent component when associations change
  useEffect(() => {
    onChange(associations);
  }, [associations, onChange]);
  
  // Handle organisation selection
  const handleOrganisationChange = (value: string) => {
    setSelectedOrganisationId(value);
    
    // Find the organisation name
    const org = organisations.find(org => org.organisationId === value);
    if (org) {
      setSelectedOrganisationName(org.organisationName);
    }
  };
  
  // Handle job title change
  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
  };
  
  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };
  
  // Add a new association
  const handleAddAssociation = () => {
    if (!selectedOrganisationId) return;
    
    // Check if this organisation is already associated
    const exists = associations.some(assoc => assoc.organisationId === selectedOrganisationId);
    if (exists) {
      // Could show an error message here
      return;
    }
    
    // Add the new association
    const newAssociation: OrganisationAssociation = {
      organisationId: selectedOrganisationId,
      organisationName: selectedOrganisationName,
      jobTitle: jobTitle || undefined,
      role: role || undefined
    };
    
    setAssociations([...associations, newAssociation]);
    
    // Reset form
    setSelectedOrganisationId('');
    setSelectedOrganisationName('');
    setJobTitle('');
    setRole('staff');
  };
  
  // Remove an association
  const handleRemoveAssociation = (index: number) => {
    const newAssociations = [...associations];
    newAssociations.splice(index, 1);
    setAssociations(newAssociations);
  };
  
  // Edit an association
  const handleEditAssociation = (index: number, field: keyof OrganisationAssociation, value: string) => {
    const newAssociations = [...associations];
    newAssociations[index] = {
      ...newAssociations[index],
      [field]: value
    };
    setAssociations(newAssociations);
  };
  
  return (
    <div className={`w-full ${className}`}>
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Organisation Associations
      </h3>
      
      {/* Add New Association Form */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Organisation Selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organisation
          </label>
          <AutocompleteSelect
            options={organisations.map(org => ({
              value: org.organisationId,
              label: org.organisationName
            }))}
            placeholder={loadingOrganisations ? "Loading organisations..." : "Select Organisation"}
            defaultValue={selectedOrganisationId}
            onChange={handleOrganisationChange}
          />
        </div>
        
        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={handleJobTitleChange}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            placeholder="Enter job title"
          />
        </div>
        
        {/* Role */}
        <div>
          <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          >
            <option value="primary">Primary Contact</option>
            <option value="secondary">Secondary Contact</option>
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="technical">Technical Contact</option>
            <option value="billing">Billing Contact</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      {/* Add Button */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={handleAddAssociation}
          disabled={!selectedOrganisationId}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Add Organisation
        </button>
      </div>
      
      {/* Associations List */}
      {associations.length > 0 ? (
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Organisation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {associations.map((assoc, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {assoc.organisationName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <input
                      type="text"
                      value={assoc.jobTitle || ''}
                      onChange={(e) => handleEditAssociation(index, 'jobTitle', e.target.value)}
                      className="w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0 dark:text-white"
                      placeholder="No job title"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <select
                      value={assoc.role || 'staff'}
                      onChange={(e) => handleEditAssociation(index, 'role', e.target.value)}
                      aria-label={`Role for ${assoc.organisationName}`}
                      className="w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0 dark:text-white"
                    >
                      <option value="primary">Primary Contact</option>
                      <option value="secondary">Secondary Contact</option>
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                      <option value="technical">Technical Contact</option>
                      <option value="billing">Billing Contact</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleRemoveAssociation(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          No organisations associated with this contact.
        </div>
      )}
    </div>
  );
};

export default OrganisationAssociationManager;
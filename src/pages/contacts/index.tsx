import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { useContactsWithOrganisations } from "../../hooks/contacts/useContactsWithOrganisations";
import { Contact, ContactRole, ContactStatus } from "../../types/Contact";
import ContactCard from "./components/ContactCard";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

/**
 * Contacts Page Component
 * 
 * This component displays and manages contacts in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * This component is the main entry point for the Contacts section of the application.
 * It works in conjunction with the following sub-components:
 * - ContactCreate: For creating new contacts
 * - ContactView: For viewing contact details
 * - ContactEdit: For editing existing contacts
 * 
 * @returns {JSX.Element} The rendered Contacts page
 */
const Contacts: React.FC = () => {
  // Use navigate hook for routing
  const navigate = useNavigate();
 
  // Get contacts with organisations data and actions from the hook
  const {
    contactsWithOrganisations,
    organisations,
    loading,
    error,
    fetchContactsWithOrganisations,
    searchContactsWithOrganisations,
    filterContactsByOrganisation,
    filterContactsByRole,
    filterContactsByStatus
  } = useContactsWithOrganisations();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [organisationFilter, setOrganisationFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
    
  // Fetch contacts on component mount
  useEffect(() => {
    fetchContactsWithOrganisations();
  }, [fetchContactsWithOrganisations]);
  
  // Handle search input change with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search term is empty, reset to filtered contacts
    if (!value.trim()) {
      fetchContactsWithOrganisations();
      return;
    }
    
    // Search contacts
    const delayDebounceFn = setTimeout(() => {
      searchContactsWithOrganisations(value);
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [fetchContactsWithOrganisations, searchContactsWithOrganisations]);
  
  // Handle organisation filter change
  const handleOrganisationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrganisationFilter(e.target.value);
    filterContactsByOrganisation(e.target.value || null);
  };
  
  // Handle role filter change
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    filterContactsByRole(e.target.value || null);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    filterContactsByStatus(e.target.value || null);
  };
  
  // Handle add contact button click
  const handleAddContact = () => {
    navigate('/contacts/new');
  };
 
  return (
    <>
      <PageMeta
        title="Contacts | Jezweb Hub"
        description="Manage client and partner contacts in the Jezweb Hub system"
      />
      
      <PageBreadcrumb 
        pageTitle="Contacts" 
        items={[]}
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Contacts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage client and partner contacts
          </p>
        </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
          </div>
          <div>
            <select 
              aria-label="Filter by organisation"
              value={organisationFilter}
              onChange={handleOrganisationFilterChange}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Organisations</option>
              {organisations.map((org) => (
                <option key={org.organisationId} value={org.organisationId}>
                  {org.organisationName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by role"
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="technical">Technical Contact</option>
              <option value="billing">Billing Contact</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="former">Former</option>
            </select>
          </div>
        </div>
        <button 
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleAddContact}
        >
          Add Contact
        </button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Loading State */}
        {loading && (
          <div className="col-span-full flex h-60 flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contacts...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error.message}</span>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && contactsWithOrganisations.length === 0 && (
          <div className="col-span-full flex h-60 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg
              className="mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No contacts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || organisationFilter || roleFilter || statusFilter
                ? "Try adjusting your search or filters"
                : "Add your first contact to get started"}
            </p>
          </div>
        )}
        
        {/* Contact Cards */}
        {!loading && !error && contactsWithOrganisations.map((contact) => (
          <ContactCard
            key={contact.contactId}
            contact={contact}
            organisationName={contact.primaryOrganisation?.organisationName}
            role={contact.primaryOrganisation?.role}
          />
        ))}
 
      </div>
    </div>
    </>
  );
};

export default Contacts;
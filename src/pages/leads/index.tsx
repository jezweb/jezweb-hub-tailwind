/**
 * Leads Index Page
 * 
 * This is the main leads listing page that displays leads in either table or card view.
 * It includes filtering, sorting, and search functionality, as well as actions to
 * create, view, edit, and delete leads.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../hooks/leads/useLeads';
import { useLeadFormFields } from '../../hooks/leads/useLeadFormFields';
import LeadTable from './components/LeadTable';
import LeadCard from './components/LeadCard';
import { Lead } from '../../types/Lead';

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get leads data and actions from the useLeads hook
  const {
    leads,
    loading,
    error,
    fetchLeads,
    deleteLead,
    searchLeads
  } = useLeads();
  
  // Get form field values for filtering
  const { statusValues, leadSources, loading: loadingFormFields } = useLeadFormFields();
  
  // State for view mode (table or card)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    searchTerm: ''
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const activeFilters: any = {};
    
    if (filters.status) {
      activeFilters.status = filters.status;
    }
    
    if (filters.source) {
      activeFilters.source = filters.source;
    }
    
    if (filters.searchTerm) {
      searchLeads(filters.searchTerm);
    } else {
      fetchLeads(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      source: '',
      searchTerm: ''
    });
    
    fetchLeads({}, sortField, sortDirection);
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
    
    // Apply sort
    fetchLeads(
      filters.status || filters.source ? { status: filters.status, source: filters.source } : {},
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view lead action
  const handleViewLead = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };
  
  // Handle edit lead action
  const handleEditLead = (leadId: string) => {
    navigate(`/leads/${leadId}/edit`);
  };
  
  // Handle delete lead action
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(leadId);
        // Leads will be refreshed automatically by the deleteLead function
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };
  
  // Handle create lead action
  const handleCreateLead = () => {
    console.log('Navigating to: /leads/create');
    navigate('/leads/create');
  };
  
  // Show loading state
  if (loading && !leads.length) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading leads...</span>
      </div>
    );
  }
  
  // Show error state
  if (error && !leads.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Leads</h2>
          <p className="text-red-700 dark:text-red-300">
            {error.message}
          </p>
          <button
            onClick={() => fetchLeads()}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
        
        <button
          onClick={handleCreateLead}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Lead
        </button>
      </div>
      
      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search leads..."
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">All Statuses</option>
              {loadingFormFields ? (
                <option value="" disabled>Loading statuses...</option>
              ) : (
                statusValues.map((status) => (
                  <option key={status.id} value={status.value}>
                    {status.value}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Source Filter */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Source
            </label>
            <select
              id="source"
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">All Sources</option>
              {loadingFormFields ? (
                <option value="" disabled>Loading sources...</option>
              ) : (
                leadSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {/* Filter Actions */}
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode('card')}
            className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Cards
          </button>
        </div>
      </div>
      
      {/* Leads Display */}
      {leads.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No leads found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filters.status || filters.source || filters.searchTerm
              ? 'No leads match your filters. Try adjusting your search criteria.'
              : 'You have not created any leads yet. Click the "Create Lead" button to get started.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <LeadTable
          leads={leads}
          isLoading={loading}
          onViewLead={handleViewLead}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead: Lead) => (
            <LeadCard
              key={lead.leadId}
              lead={lead}
              onViewLead={handleViewLead}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
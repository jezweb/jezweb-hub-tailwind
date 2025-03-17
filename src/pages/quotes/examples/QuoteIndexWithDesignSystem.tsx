/**
 * QuoteIndex with Design System
 * 
 * This is an example implementation of the Quotes listing page using the new design system components.
 * It demonstrates how to migrate from the old styling to the new standardized components.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../../../hooks/quotes/useQuotes';
import QuoteTable from '../components/QuoteTable';
import { Quote, QuoteStatus } from '../../../types/Quote';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { 
  Container, 
  PageHeading, 
  Card, 
  ActionButton,
  LoadingState,
  ErrorMessage,
  FormSection
} from '../../../components/ui/design-system';
import QuoteCardWithDesignSystem from './QuoteCardWithDesignSystem';

/**
 * QuoteIndexWithDesignSystem component
 * 
 * This component demonstrates how to use the design system components
 * to create a consistent and maintainable UI for the quotes listing page.
 */
const QuoteIndexWithDesignSystem: React.FC = () => {
  const navigate = useNavigate();
  
  // Get quotes data and actions from the useQuotes hook
  const {
    quotes,
    loading,
    error,
    fetchQuotes,
    deleteQuote,
    searchQuotes
  } = useQuotes();
  
  // State for view mode (table or card)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('quoteDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch quotes on component mount
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [name === 'startDate' ? 'start' : 'end']: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Apply filters
  const applyFilters = () => {
    const activeFilters: any = {};
    
    if (filters.status) {
      activeFilters.status = filters.status;
    }
    
    if (filters.dateRange.start) {
      activeFilters.startDate = filters.dateRange.start;
    }
    
    if (filters.dateRange.end) {
      activeFilters.endDate = filters.dateRange.end;
    }
    
    if (filters.searchTerm) {
      searchQuotes(filters.searchTerm);
    } else {
      fetchQuotes(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      searchTerm: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
    
    fetchQuotes({}, sortField, sortDirection);
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
    fetchQuotes(
      filters.status || filters.dateRange.start || filters.dateRange.end
        ? {
            status: filters.status,
            startDate: filters.dateRange.start,
            endDate: filters.dateRange.end
          }
        : {},
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view quote action
  const handleViewQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };
  
  // Handle edit quote action
  const handleEditQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}/edit`);
  };
  
  // Handle delete quote action
  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteQuote(quoteId);
        // Quotes will be refreshed automatically by the deleteQuote function
      } catch (error) {
        console.error('Error deleting quote:', error);
      }
    }
  };
  
  // Handle create quote action
  const handleCreateQuote = () => {
    navigate('/quotes/create');
  };
  
  // Show loading state
  if (loading && !quotes.length) {
    return <LoadingState message="Loading quotes..." fullPage />;
  }
  
  // Show error state
  if (error && !quotes.length) {
    return (
      <Container>
        <ErrorMessage
          title="Error Loading Quotes"
          message={error.message}
          onRetry={() => fetchQuotes()}
        />
      </Container>
    );
  }
  
  return (
    <Container>
      <PageHeading
        title="Quotes"
        actions={
          <ActionButton
            variant="primary"
            onClick={handleCreateQuote}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Create Quote
          </ActionButton>
        }
      />
      
      {/* Filters */}
      <Card className="mb-6">
        <FormSection title="Filters">
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
                placeholder="Search quotes..."
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
                aria-label="Filter by quote status"
              >
                <option value="">All Statuses</option>
                <option value={QuoteStatus.DRAFT}>Draft</option>
                <option value={QuoteStatus.SENT}>Sent</option>
                <option value={QuoteStatus.ACCEPTED}>Accepted</option>
                <option value={QuoteStatus.REJECTED}>Rejected</option>
                <option value={QuoteStatus.EXPIRED}>Expired</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  From
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.dateRange.start}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  To
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.dateRange.end}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex items-end space-x-2">
              <ActionButton
                variant="primary"
                onClick={applyFilters}
              >
                Apply Filters
              </ActionButton>
              <ActionButton
                variant="outline"
                onClick={resetFilters}
              >
                Reset
              </ActionButton>
            </div>
          </div>
        </FormSection>
      </Card>
      
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
      
      {/* Quotes Display */}
      {quotes.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No quotes found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filters.status || filters.dateRange.start || filters.dateRange.end || filters.searchTerm
                ? 'No quotes match your filters. Try adjusting your search criteria.'
                : 'You have not created any quotes yet. Click the "Create Quote" button to get started.'}
            </p>
          </div>
        </Card>
      ) : viewMode === 'table' ? (
        <QuoteTable
          quotes={quotes}
          isLoading={loading}
          onViewQuote={handleViewQuote}
          onEditQuote={handleEditQuote}
          onDeleteQuote={handleDeleteQuote}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote: Quote) => (
            <QuoteCardWithDesignSystem
              key={quote.quoteId}
              quote={quote}
              onViewQuote={handleViewQuote}
              onEditQuote={handleEditQuote}
              onDeleteQuote={handleDeleteQuote}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default QuoteIndexWithDesignSystem;
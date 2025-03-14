import React from "react";

/**
 * Notes Page Component
 * 
 * This component displays and manages notes in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered Notes page
 */
const Notes: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Notes
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage notes and documentation
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
              aria-label="Filter by category"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="meeting">Meeting Notes</option>
              <option value="client">Client Notes</option>
              <option value="project">Project Notes</option>
              <option value="internal">Internal Notes</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by related to"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Related Items</option>
              <option value="organisation">Organisations</option>
              <option value="contact">Contacts</option>
              <option value="project">Projects</option>
              <option value="website">Websites</option>
              <option value="ticket">Tickets</option>
            </select>
          </div>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Empty State */}
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No notes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first note to get started
          </p>
        </div>

        {/* Note Card Template (Hidden for now) */}
        <div className="hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Note Title
              </h3>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Meeting Notes
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg
                className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span>Created: 01/01/2023</span>
            </div>
          </div>
          <div className="p-4">
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
              Note content preview would appear here...
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Related to: Organisation Name
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Project Name
              </span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  Created by: User Name
                </span>
              </div>
              <button className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
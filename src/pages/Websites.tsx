import React from "react";

/**
 * Websites Page Component
 * 
 * This component displays and manages client websites in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered Websites page
 */
const Websites: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Websites
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage client websites and domains
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search websites..."
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
              aria-label="Filter by organisation"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Organisations</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by platform"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Platforms</option>
              <option value="wordpress">WordPress</option>
              <option value="shopify">Shopify</option>
              <option value="wix">Wix</option>
              <option value="squarespace">Squarespace</option>
              <option value="custom">Custom</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by status"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="development">Development</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Add Website
        </button>
      </div>

      {/* Websites Grid */}
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
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No websites found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add your first website to get started
          </p>
        </div>

        {/* Website Card Template (Hidden for now) */}
        <div className="hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                ></path>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-lg font-medium text-white">
                Website Name
              </h3>
              <p className="text-sm text-gray-200">
                example.com
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Organisation Name
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            </div>
            <div className="mb-4 space-y-2">
              <div className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Platform: WordPress
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
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
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Renewal: 01/01/2023
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Details
              </button>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                Visit Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Websites;
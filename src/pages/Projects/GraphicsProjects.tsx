import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * GraphicsProjects Component
 * 
 * This component displays and manages graphics design projects in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered GraphicsProjects page
 */
const GraphicsProjects: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Graphics Projects | Jezweb Hub</title>
      </Helmet>

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Graphics Projects
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage graphic design, branding, and visual content projects
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search graphics projects..."
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
                aria-label="Filter by status"
                className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="design">In Progress</option>
                <option value="review">Client Review</option>
                <option value="revision">Revision</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
                aria-label="Filter by graphics type"
                className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="logo">Logo Design</option>
                <option value="branding">Branding Package</option>
                <option value="print">Print Materials</option>
                <option value="digital">Digital Assets</option>
                <option value="social">Social Media Graphics</option>
                <option value="illustration">Illustrations</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Create Graphics Project
          </button>
        </div>

        {/* Projects Grid */}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No graphics projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first graphics project to get started
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GraphicsProjects;
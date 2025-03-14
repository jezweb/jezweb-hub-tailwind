import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SeoProjects Component
 * 
 * This component displays and manages SEO projects in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered SeoProjects page
 */
const SeoProjects: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>SEO Projects | Jezweb Hub</title>
      </Helmet>

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            SEO Projects
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage search engine optimisation and digital marketing projects
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search SEO projects..."
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
                <option value="audit">Audit</option>
                <option value="implementation">Implementation</option>
                <option value="monitoring">Monitoring</option>
                <option value="reporting">Reporting</option>
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
                aria-label="Filter by SEO type"
                className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="on-page">On-Page SEO</option>
                <option value="off-page">Off-Page SEO</option>
                <option value="technical">Technical SEO</option>
                <option value="local">Local SEO</option>
                <option value="content">Content Strategy</option>
                <option value="keyword">Keyword Research</option>
                <option value="audit">SEO Audit</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Create SEO Project
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No SEO projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first SEO project to get started
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeoProjects;
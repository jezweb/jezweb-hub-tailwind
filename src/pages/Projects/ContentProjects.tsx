import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * ContentProjects Component
 * 
 * This component displays and manages content creation projects in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered ContentProjects page
 */
const ContentProjects: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Content Projects | Jezweb Hub</title>
      </Helmet>

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Content Projects
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage content creation, copywriting, and editorial projects
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search content projects..."
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
                <option value="research">Research</option>
                <option value="drafting">Drafting</option>
                <option value="review">Review</option>
                <option value="revision">Revision</option>
                <option value="approval">Client Approval</option>
                <option value="publishing">Publishing</option>
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
                aria-label="Filter by content type"
                className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="blog">Blog Posts</option>
                <option value="article">Articles</option>
                <option value="website">Website Copy</option>
                <option value="social">Social Media Content</option>
                <option value="email">Email Campaigns</option>
                <option value="whitepaper">Whitepapers</option>
                <option value="case-study">Case Studies</option>
                <option value="ebook">eBooks</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Create Content Project
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No content projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first content project to get started
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentProjects;
import React from "react";

/**
 * Articles Page Component
 * 
 * This component displays and manages articles in the Jezweb Hub system.
 * It provides functionality to view, search, filter, create, edit, and delete articles.
 * Articles represent reusable content that can be used across websites, emails, and other communications.
 * 
 * @returns {JSX.Element} The rendered Articles page
 */
const Articles: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Articles
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage reusable article content
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
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
              <option value="blog">Blog</option>
              <option value="news">News</option>
              <option value="faq">FAQ</option>
              <option value="tutorial">Tutorial</option>
              <option value="case-study">Case Study</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by status"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Add Article
        </button>
      </div>

      {/* Articles Grid */}
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add your first article to get started
          </p>
        </div>

        {/* Article Card Template (Hidden for now) */}
        <div className="hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Blog
                </span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Published
                </span>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                10 Tips for Effective SEO
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                Learn the top 10 strategies to improve your website's search engine ranking and drive more organic traffic to your business.
              </p>
            </div>
            <div className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Author:</span>
                <span className="font-medium text-gray-900 dark:text-white">Jane Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Published:</span>
                <span className="font-medium text-gray-900 dark:text-white">15 Feb 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Word Count:</span>
                <span className="font-medium text-gray-900 dark:text-white">1,250</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Edit
              </button>
              <button className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
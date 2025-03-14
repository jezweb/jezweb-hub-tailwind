import React from "react";

/**
 * Tasks Page Component
 * 
 * This component displays and manages tasks in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered Tasks page
 */
const Tasks: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tasks
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and track tasks and to-dos
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
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
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by priority"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by project"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Projects</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by assigned to"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Assignees</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create Task
        </button>
      </div>

      {/* Tasks Board */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* To Do Column */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              To Do
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks that need to be started
            </p>
          </div>
          <div className="p-4">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
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
              <p className="text-gray-600 dark:text-gray-400">
                No tasks to do
              </p>
            </div>

            {/* Task Card Template (Hidden for now) */}
            <div className="hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Project Name
                </span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  High
                </span>
              </div>
              <h4 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                Task Title
              </h4>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Brief description of the task goes here...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <svg
                      className="h-full w-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                    Due: 01/01/2023
                  </span>
                </div>
                <button className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Column */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              In Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks currently being worked on
            </p>
          </div>
          <div className="p-4">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
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
              <p className="text-gray-600 dark:text-gray-400">
                No tasks in progress
              </p>
            </div>
          </div>
        </div>

        {/* Review Column */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Review
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks awaiting review
            </p>
          </div>
          <div className="p-4">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
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
              <p className="text-gray-600 dark:text-gray-400">
                No tasks in review
              </p>
            </div>
          </div>
        </div>

        {/* Completed Column */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Completed
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks that have been completed
            </p>
          </div>
          <div className="p-4">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
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
              <p className="text-gray-600 dark:text-gray-400">
                No completed tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
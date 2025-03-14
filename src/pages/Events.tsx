import React from "react";

/**
 * Events Page Component
 * 
 * This component displays and manages events in the Jezweb Hub system.
 * It provides a placeholder structure that can be extended with actual data and functionality.
 * 
 * @returns {JSX.Element} The rendered Events page
 */
const Events: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Events
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage meetings, appointments, and deadlines
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
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
              aria-label="Filter by type"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="meeting">Meeting</option>
              <option value="call">Call</option>
              <option value="deadline">Deadline</option>
              <option value="appointment">Appointment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <select 
              aria-label="Filter by date range"
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
              <option value="this-month">This Month</option>
              <option value="next-month">Next Month</option>
              <option value="custom">Custom Range</option>
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
            </select>
          </div>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create Event
        </button>
      </div>

      {/* Calendar View */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              March 2025
            </h2>
            <div className="flex items-center space-x-2">
              <button aria-label="Previous month" className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <button aria-label="Next month" className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 text-center">
            <div className="font-medium text-gray-500 dark:text-gray-400">Sun</div>
            <div className="font-medium text-gray-500 dark:text-gray-400">Mon</div>
            <div className="font-medium text-gray-500 dark:text-gray-400">Tue</div>
            <div className="font-medium text-gray-500 dark:text-gray-400">Wed</div>
            <div className="font-medium text-gray-500 dark:text-gray-400">Thu</div>
            <div className="font-medium text-gray-500 dark:text-gray-400">Fri</div>
            <div className="font-medium text-gray-500 dark:text-gray-400">Sat</div>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {/* Calendar days would be generated here */}
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            <div className="h-24 rounded-lg border border-gray-200 p-2 dark:border-gray-700"></div>
            {/* More days would follow */}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Upcoming Events
          </h2>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No upcoming events
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first event to get started
            </p>
          </div>

          {/* Event Card Template (Hidden for now) */}
          <div className="mb-4 hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Event Title
              </h3>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Meeting
              </span>
            </div>
            <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
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
              <span>01/01/2023 10:00 AM - 11:00 AM</span>
            </div>
            <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
              Event description would appear here...
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Related to: Organisation Name
              </span>
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

export default Events;
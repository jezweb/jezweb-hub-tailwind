import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

/**
 * Projects Dashboard Component
 * 
 * This component serves as the main entry point for the projects section of the Jezweb Hub.
 * It provides an overview of all project types and quick access to each project category.
 * 
 * The dashboard displays summary statistics for each project type and links to their
 * respective detailed views.
 * 
 * @returns {JSX.Element} The rendered Projects dashboard
 */
const Projects: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Projects Dashboard | Jezweb Hub</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Projects Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of all project types and activities
          </p>
        </div>

        {/* Project Type Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
          {/* Website Projects Card */}
          <Link
            to="/website-projects"
            className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 11.39 4.08 10.79 4.21 10.22L8 14V15C8 16.1 8.9 17 10 17V19.93C6.45 19.06 4 15.81 4 12ZM17.89 17.4C17.63 16.59 16.89 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.21 15.97 17.89 17.4Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  Website Projects
                </h4>
                <span className="text-sm font-medium">0 Active</span>
              </div>
            </div>
          </Link>

          {/* App Projects Card */}
          <Link
            to="/app-projects"
            className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM7 4H17V13H7V4ZM7 20V15H17V20H7Z"
                  fill="currentColor"
                />
                <path
                  d="M12 17C12.83 17 13.5 17.67 13.5 18.5C13.5 19.33 12.83 20 12 20C11.17 20 10.5 19.33 10.5 18.5C10.5 17.67 11.17 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  App Projects
                </h4>
                <span className="text-sm font-medium">0 Active</span>
              </div>
            </div>
          </Link>

          {/* Graphics Projects Card */}
          <Link
            to="/graphics-projects"
            className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C6.49 22 2 17.51 2 12C2 6.49 6.49 2 12 2C17.51 2 22 6.04 22 12C22 17.51 17.51 22 12 22ZM12 4C7.59 4 4 7.59 4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4ZM15 16H9C8.45 16 8 15.55 8 15C8 14.45 8.45 14 9 14H15C15.55 14 16 14.45 16 15C16 15.55 15.55 16 15 16ZM15 12H9C8.45 12 8 11.55 8 11C8 10.45 8.45 10 9 10H15C15.55 10 16 10.45 16 11C16 11.55 15.55 12 15 12ZM15 8H9C8.45 8 8 7.55 8 7C8 6.45 8.45 6 9 6H15C15.55 6 16 6.45 16 7C16 7.55 15.55 8 15 8Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  Graphics Projects
                </h4>
                <span className="text-sm font-medium">0 Active</span>
              </div>
            </div>
          </Link>

          {/* SEO Projects Card */}
          <Link
            to="/seo-projects"
            className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  SEO Projects
                </h4>
                <span className="text-sm font-medium">0 Active</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Recent Projects
            </h4>
            <Link
              to="/projects"
              className="flex items-center gap-2 text-sm font-medium text-primary"
            >
              View All
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
            </Link>
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Project Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Type
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Organisation
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Due Date
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Empty state */}
                <tr>
                  <td colSpan={6} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex justify-center">
                      <div className="text-center">
                        <p className="text-lg font-medium text-black dark:text-white">
                          No projects yet
                        </p>
                        <p className="mt-1 text-sm text-body">
                          Create your first project to get started
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Activity */}
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  Recent Activity
                </h4>
              </div>
              
              <div className="h-[200px] flex items-center justify-center border border-dashed border-stroke dark:border-strokedark">
                <div className="text-center">
                  <p className="text-lg font-medium text-black dark:text-white">
                    No recent activity
                  </p>
                  <p className="mt-1 text-sm text-body">
                    Project activity will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
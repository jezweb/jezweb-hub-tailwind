import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Clients Component
 * 
 * This component serves as the client management page for the Jezweb Hub application.
 * It provides a clean, empty layout that follows the TailAdmin Pro design
 * but without the demo content, allowing for custom client management features 
 * to be added as needed.
 */
const Clients: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Clients | Jezweb Hub</title>
      </Helmet>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Clients
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90">
            <svg
              className="mr-2 h-4 w-4"
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
            Add Client
          </button>
        </div>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                0
              </h4>
              <span className="text-sm font-medium">Total Clients</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V9C2 8.46957 2.21071 7.96086 2.58579 7.58579C2.96086 7.21071 3.46957 7 4 7H20C20.5304 7 21.0391 7.21071 21.4142 7.58579C21.7893 7.96086 22 8.46957 22 9V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                0
              </h4>
              <span className="text-sm font-medium">Active Projects</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 10H1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 5V11L15 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                0
              </h4>
              <span className="text-sm font-medium">Pending Tasks</span>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                0
              </h4>
              <span className="text-sm font-medium">Organisations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="mt-4 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-6">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            <div className="flex min-w-47.5">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Clients
              </h4>
            </div>
          </div>
          
          <div className="flex">
            <div className="relative z-20 inline-block">
              <select 
                aria-label="Client status filter" 
                title="Filter by client status"
                className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              >
                <option value="">All Clients</option>
                <option value="">Active</option>
                <option value="">Inactive</option>
              </select>
              <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.47072 1.08816C0.47072 1.02932 0.47072 0.976424 0.493202 0.929471C0.515684 0.882518 0.553409 0.841612 0.597695 0.808658C0.642022 0.775704 0.691619 0.751751 0.746918 0.738489C0.802168 0.725226 0.857418 0.725226 0.912668 0.738489C0.945623 0.746121 0.978138 0.757383 1.01068 0.776144C1.04322 0.794906 1.07029 0.817669 1.09189 0.84679L4.21943 4.28462L7.32198 0.84679C7.36393 0.799498 7.42194 0.766544 7.48452 0.753281C7.54709 0.740019 7.61425 0.748575 7.67682 0.78153C7.73895 0.814484 7.79149 0.867437 7.82852 0.934089C7.86533 1.00074 7.8795 1.07513 7.86533 1.14951C7.85098 1.2239 7.81474 1.28987 7.76345 1.34412L4.49987 4.97503C4.45792 5.02132 4.39991 5.05427 4.33734 5.06753C4.27455 5.08079 4.20739 5.07224 4.14482 5.03928C4.08248 5.00633 4.02995 4.95338 3.99292 4.88673L0.597695 1.15587C0.571713 1.1163 0.553409 1.07138 0.540147 1.02132C0.52697 0.971252 0.515684 0.917298 0.51016 0.859344C0.49327 0.859344 0.47072 0.868901 0.47072 0.868901V1.08816Z"
                    fill="#64748B"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Client Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Organisation
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Phone
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
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
                        No clients yet
                      </p>
                      <p className="mt-1 text-sm text-body">
                        Click the "Add Client" button to add a new client
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Area */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
              <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                <div className="flex min-w-47.5">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Client Details
                  </h4>
                </div>
              </div>
            </div>
            
            <div className="mt-4 h-[300px] flex items-center justify-center border border-dashed border-stroke dark:border-strokedark">
              <div className="text-center">
                <p className="text-lg font-medium text-black dark:text-white">
                  Select a client to view details
                </p>
                <p className="mt-1 text-sm text-body">
                  Client information, projects, and contact details will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clients;
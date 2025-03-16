/**
 * WebsiteTable Component
 * 
 * This component displays websites in a table format with key information and actions.
 * It's used in the table view of the Websites page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { WebsiteWithOrganisation } from '../../../types/Website';

interface WebsiteTableProps {
  websites: WebsiteWithOrganisation[];
  onDelete?: (websiteId: string) => void;
}

const WebsiteTable: React.FC<WebsiteTableProps> = ({ websites, onDelete }) => {
  const handleDelete = (websiteId: string) => {
    if (onDelete) {
      onDelete(websiteId);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Website
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Organisation
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Platform
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Hosting
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
              {websites.map((website) => (
                <tr key={website.websiteId}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {website.domain}
                    </h5>
                    {website.notes && (
                      <p className="text-sm">{website.notes.substring(0, 50)}{website.notes.length > 50 ? '...' : ''}</p>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {website.organisation?.organisationName || 'Unknown Organisation'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{website.cms.type}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{website.hosting.provider}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                      website.status === 'active' ? 'bg-success bg-opacity-10 text-success' :
                      website.status === 'development' ? 'bg-warning bg-opacity-10 text-warning' :
                      website.status === 'staging' ? 'bg-info bg-opacity-10 text-info' :
                      'bg-danger bg-opacity-10 text-danger'
                    }`}>
                      {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <Link to={`/websites/${website.websiteId}`} className="hover:text-primary" title="View Website Details">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <Link to={`/websites/edit/${website.websiteId}`} className="hover:text-primary" title="Edit Website">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                            fill=""
                          />
                          <path
                            d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <a
                        href={`https://${website.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                        title="Visit Website"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 3.75C4.83563 3.75 1.25 7.33563 1.25 11.5C1.25 15.6644 4.83563 19.25 9 19.25C13.1644 19.25 16.75 15.6644 16.75 11.5C16.75 7.33563 13.1644 3.75 9 3.75ZM9 18C5.53125 18 2.5 14.9688 2.5 11.5C2.5 8.03125 5.53125 5 9 5C12.4688 5 15.5 8.03125 15.5 11.5C15.5 14.9688 12.4688 18 9 18Z"
                            fill=""
                          />
                          <path
                            d="M9 7.5C8.30312 7.5 7.75 8.05312 7.75 8.75V11.5C7.75 12.1969 8.30312 12.75 9 12.75C9.69688 12.75 10.25 12.1969 10.25 11.5V8.75C10.25 8.05312 9.69688 7.5 9 7.5Z"
                            fill=""
                          />
                          <path
                            d="M9 14C8.58437 14 8.25 14.3344 8.25 14.75C8.25 15.1656 8.58437 15.5 9 15.5C9.41563 15.5 9.75 15.1656 9.75 14.75C9.75 14.3344 9.41563 14 9 14Z"
                            fill=""
                          />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleDelete(website.websiteId)}
                        className="hover:text-danger"
                        title="Delete Website"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M10.8789 9.67504C10.5414 9.64692 10.2602 9.90004 10.232 10.2375L10.0039 13.2375C9.97578 13.5469 10.2289 13.8281 10.5664 13.8562C10.5852 13.8562 10.6039 13.8562 10.6227 13.8562C10.9227 13.8562 11.1852 13.6219 11.2133 13.3219L11.4414 10.3219C11.4695 9.98442 11.2164 9.70317 10.8789 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M7.13867 9.67504C6.80117 9.70317 6.54805 10.0125 6.57617 10.3219L6.80429 13.3219C6.83242 13.6219 7.09492 13.8562 7.39492 13.8562C7.41367 13.8562 7.43242 13.8562 7.45117 13.8562C7.78867 13.828 8.04179 13.5469 8.01367 13.2375L7.78554 10.2375C7.75742 9.90004 7.47617 9.64692 7.13867 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebsiteTable;
/**
 * WebsiteCard Component
 * 
 * This component displays a website as a card with key information and actions.
 * It's used in the grid view of the Websites page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { WebsiteWithOrganisation } from '../../../types/Website';

interface WebsiteCardProps {
  website: WebsiteWithOrganisation;
  onDelete?: (websiteId: string) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(website.websiteId);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
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
            {website.domain}
          </h3>
          <p className="text-sm text-gray-200">
            {website.cms.type}
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {website.organisation?.organisationName || 'Unknown Organisation'}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            website.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            website.status === 'development' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
            website.status === 'staging' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}>
            {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
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
              Hosting: {website.hosting.provider}
            </span>
          </div>
          {website.domain_hosting?.expiryDate && (
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
                Renewal: {website.domain_hosting.expiryDate}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Link
            to={`/websites/${website.websiteId}`}
            className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Details
          </Link>
          <a
            href={`https://${website.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;
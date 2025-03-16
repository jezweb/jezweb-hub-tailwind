/**
 * WebsiteDetails Page
 * 
 * This page displays detailed information about a website.
 * It uses the useWebsitesWithOrganisations hook to fetch website data with organisation information.
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWebsitesWithOrganisations } from '../../hooks/websites/useWebsitesWithOrganisations';

const WebsiteDetails: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const {
    selectedWebsiteWithOrganisation: website,
    fetchWebsiteWithOrganisationById,
    loadingWebsite,
    websiteError
  } = useWebsitesWithOrganisations();
  
  // Fetch website data when component mounts
  useEffect(() => {
    if (websiteId) {
      fetchWebsiteWithOrganisationById(websiteId);
    }
  }, [websiteId, fetchWebsiteWithOrganisationById]);
  
  // Handle website not found
  useEffect(() => {
    if (websiteError) {
      navigate('/websites', { replace: true });
    }
  }, [websiteError, navigate]);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <>
      <Helmet>
        <title>{website?.domain || 'Website Details'} | Jezweb Hub</title>
      </Helmet>
      
      <div className="mx-auto max-w-270">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              {website?.domain || 'Website Details'}
            </h2>
            {website?.organisation && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {website.organisation.organisationName}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/websites/edit/${websiteId}`}
              className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-opacity-90"
            >
              Edit Website
            </Link>
            <a
              href={`https://${website?.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              Visit Website
            </a>
          </div>
        </div>
        
        {loadingWebsite ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : website ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Basic Information
              </h3>
              
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Domain</span>
                <span className="block text-base font-medium text-black dark:text-white">{website.domain}</span>
              </div>
              
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  website.status === 'active' ? 'bg-success bg-opacity-10 text-success' :
                  website.status === 'development' ? 'bg-warning bg-opacity-10 text-warning' :
                  website.status === 'staging' ? 'bg-info bg-opacity-10 text-info' :
                  'bg-danger bg-opacity-10 text-danger'
                }`}>
                  {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Organisation</span>
                <Link
                  to={`/organisations/${website.organisationId}`}
                  className="block text-base font-medium text-primary hover:underline"
                >
                  {website.organisation?.organisationName || 'Unknown Organisation'}
                </Link>
              </div>
              
              {website.notes && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Notes</span>
                  <p className="text-base text-black dark:text-white">{website.notes}</p>
                </div>
              )}
            </div>
            
            {/* Hosting Information */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Hosting Information
              </h3>
              
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Provider</span>
                <span className="block text-base font-medium text-black dark:text-white">{website.hosting.provider}</span>
              </div>
              
              {website.hosting.serverId && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Server ID</span>
                  <span className="block text-base text-black dark:text-white">{website.hosting.serverId}</span>
                </div>
              )}
              
              {website.hosting.phpVersion && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">PHP Version</span>
                  <span className="block text-base text-black dark:text-white">{website.hosting.phpVersion}</span>
                </div>
              )}
              
              {website.hosting.ipAddress && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</span>
                  <span className="block text-base text-black dark:text-white">{website.hosting.ipAddress}</span>
                </div>
              )}
              
              {website.hosting.expiryDate && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</span>
                  <span className="block text-base text-black dark:text-white">{formatDate(website.hosting.expiryDate)}</span>
                </div>
              )}
              
              {website.hosting.notes && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Hosting Notes</span>
                  <p className="text-base text-black dark:text-white">{website.hosting.notes}</p>
                </div>
              )}
            </div>
            
            {/* CMS Information */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                CMS Information
              </h3>
              
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                <span className="block text-base font-medium text-black dark:text-white">{website.cms.type}</span>
              </div>
              
              {website.cms.version && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Version</span>
                  <span className="block text-base text-black dark:text-white">{website.cms.version}</span>
                </div>
              )}
              
              {website.cms.theme && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
                  <span className="block text-base text-black dark:text-white">
                    {website.cms.theme.name || 'N/A'}
                    {website.cms.theme.version && ` (v${website.cms.theme.version})`}
                    {website.cms.theme.childTheme && ` - Child: ${website.cms.theme.childTheme}`}
                  </span>
                </div>
              )}
              
              {website.cms.adminUrl && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Admin URL</span>
                  <a
                    href={website.cms.adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base text-primary hover:underline"
                  >
                    {website.cms.adminUrl}
                  </a>
                </div>
              )}
              
              {website.cms.notes && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">CMS Notes</span>
                  <p className="text-base text-black dark:text-white">{website.cms.notes}</p>
                </div>
              )}
            </div>
            
            {/* Domain & SSL Information */}
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Domain & SSL Information
              </h3>
              
              {website.domain_hosting && (
                <>
                  {website.domain_hosting.registrar && (
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Registrar</span>
                      <span className="block text-base text-black dark:text-white">{website.domain_hosting.registrar}</span>
                    </div>
                  )}
                  
                  {website.domain_hosting.hosting && (
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Domain Hosting</span>
                      <span className="block text-base text-black dark:text-white">{website.domain_hosting.hosting}</span>
                    </div>
                  )}
                  
                  {website.domain_hosting.expiryDate && (
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Domain Expiry</span>
                      <span className="block text-base text-black dark:text-white">{formatDate(website.domain_hosting.expiryDate)}</span>
                    </div>
                  )}
                  
                  {website.domain_hosting.autoRenew !== undefined && (
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Auto Renew</span>
                      <span className="block text-base text-black dark:text-white">{website.domain_hosting.autoRenew ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                </>
              )}
              
              {website.sslCertificate && (
                <>
                  {website.sslCertificate.issuer && (
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">SSL Issuer</span>
                      <span className="block text-base text-black dark:text-white">{website.sslCertificate.issuer}</span>
                    </div>
                  )}
                  
                  {website.sslCertificate.expiryDate && (
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">SSL Expiry</span>
                      <span className="block text-base text-black dark:text-white">{formatDate(website.sslCertificate.expiryDate)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">Website not found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default WebsiteDetails;
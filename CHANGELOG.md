# Changelog

All notable changes to the Jezweb Hub project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Purpose

This changelog helps track the evolution of the Jezweb Hub application over time. It provides a clear record of:
- New features and enhancements
- Bug fixes and improvements
- Breaking changes and deprecations
- Security updates

Each version entry includes the release date and categorises changes to make it easy to understand what has changed between versions.

## [1.1.0] - 2025-03-14

### Added
- Dynamic form fields stored in Firebase
  - Created FormFieldsService for CRUD operations on form field values
  - Implemented useFormFields hook for accessing and modifying form field values
  - Added FormFieldsManager component to the settings page for managing field values
- Autocomplete industry field in the Organisation creation form
  - Implemented AutocompleteField component with search and filter functionality
  - Added ability to add new industry values on-the-fly
  - Integrated with Firebase to store and retrieve industry values

### Changed
- Enhanced DynamicSelect component to use the useFormFields hook
- Updated ContactForm to use dynamic values for Role and Status fields
- Improved form validation for dynamic fields

## [1.0.0] - 2025-02-15

### Added
- Initial release of Jezweb Hub
- Core layout structure (AppLayout, AppHeader, AppSidebar)
- Firebase integration (Authentication, Firestore, Storage)
- Dashboard landing page
- Clients module
  - Organisations management
  - Contacts management
- Hosting module
  - Websites management
- Support module
  - Tickets management
- Projects module
  - Website projects
  - Graphics projects
  - App projects
  - SEO projects
  - Content projects
- Sales module
  - Leads management
  - Quotes management
- Task management with Kanban board view
- Notes, Events, Timesheets, and Articles modules
- Dark mode support
- Responsive design for all screen sizes
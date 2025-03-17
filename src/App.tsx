/**
 * App Component
 * 
 * This is the main application component that defines all routes for the Jezweb Hub application.
 * It uses React Router to handle navigation between different pages and components.
 * 
 * The routes are organized into several categories:
 * - Dashboard pages (main dashboard and module-specific dashboards)
 * - Module pages (tasks, organisations, clients, etc.)
 * - UI element pages (for design system components)
 * - Authentication pages (sign in, sign up, etc.)
 * - Error and utility pages
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import JezwebHubDashboard from "./pages/Dashboard/JezwebHub";
import Ecommerce from "./pages/Dashboard/Ecommerce";
import Stocks from "./pages/Dashboard/Stocks";
import Crm from "./pages/Dashboard/Crm";
import Marketing from "./pages/Dashboard/Marketing";
import Analytics from "./pages/Dashboard/Analytics";

// Module pages
import Tasks from "./pages/Tasks";
// Debug: Log which Organisations component is being imported
import Organisations from "./pages/organisations";
console.log("Imported Organisations component:", Organisations);
// Import the Organisation related components
import OrganisationCreate from "./pages/organisations/OrganisationCreate";
import OrganisationDetails from "./pages/organisations/OrganisationDetails";
import OrganisationEdit from "./pages/organisations/OrganisationEdit";
import Timesheets from "./pages/Timesheets";
// Projects pages
import Projects from "./pages/Projects";
import { 
  WebsiteProjects, 
  AppProjects, 
  GraphicsProjects, 
  SeoProjects, 
  ContentProjects 
} from "./pages/Projects/index";
import Clients from "./pages/Clients";
import Websites from "./pages/Websites";
import WebsiteCreate from "./pages/Websites/WebsiteCreate";
import WebsiteDetails from "./pages/Websites/WebsiteDetails";
import WebsiteEdit from "./pages/Websites/WebsiteEdit";
import Tickets from "./pages/Tickets";
import Notes from "./pages/Notes";
import Events from "./pages/Events";
import LeadsPage from "./pages/leads";
import LeadCreate from "./pages/leads/LeadCreate";
import LeadView from "./pages/leads/LeadView";
import LeadEdit from "./pages/leads/LeadEdit";
import Contacts from "./pages/contacts";
import ContactCreate from "./pages/contacts/ContactCreate";
import ContactView from "./pages/contacts/ContactView";
import ContactEdit from "./pages/contacts/ContactEdit";
import Invoices from "./pages/Invoices";
import Articles from "./pages/Articles";
import Quotes from "./pages/quotes";
import QuoteCreate from "./pages/quotes/QuoteCreate";
import QuoteView from "./pages/quotes/QuoteView";
import QuoteEdit from "./pages/quotes/QuoteEdit";
import FileManager from "./pages/FileManager";
import Calendar from "./pages/Calendar";
import PricingTables from "./pages/PricingTables";
import Faqs from "./pages/Faqs";
import UserProfiles from "./pages/UserProfiles";
import Blank from "./pages/Blank";

// Auth pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import TwoStepVerification from "./pages/AuthPages/TwoStepVerification";

// Error and utility pages
import NotFound from "./pages/OtherPage/NotFound";
import Maintenance from "./pages/OtherPage/Maintenance";
import FiveZeroZero from "./pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "./pages/OtherPage/FiveZeroThree";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import Success from "./pages/OtherPage/Success";
import DropdownLists from "./pages/settings/DropdownLists";

// UI Elements
import Carousel from "./pages/UiElements/Carousel";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Pagination from "./pages/UiElements/Pagination";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import ButtonsGroup from "./pages/UiElements/ButtonsGroup";
import Notifications from "./pages/UiElements/Notifications";
import BreadCrumb from "./pages/UiElements/BreadCrumb";
import Cards from "./pages/UiElements/Cards";
import Dropdowns from "./pages/UiElements/Dropdowns";
import Links from "./pages/UiElements/Links";
import Lists from "./pages/UiElements/Lists";
import Popovers from "./pages/UiElements/Popovers";
import Progressbar from "./pages/UiElements/Progressbar";
import Ribbons from "./pages/UiElements/Ribbons";
import Spinners from "./pages/UiElements/Spinners";
import Tabs from "./pages/UiElements/Tabs";
import Tooltips from "./pages/UiElements/Tooltips";
import Modals from "./pages/UiElements/Modals";

// Charts
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import PieChart from "./pages/Charts/PieChart";

// Task pages
import TaskKanban from "./pages/Task/TaskKanban";
import TaskList from "./pages/Task/TaskList";

// Email pages
import EmailInbox from "./pages/Email/EmailInbox";
import EmailDetails from "./pages/Email/EmailDetails";

// Chat pages
import Chats from "./pages/Chat/Chats";

// Form pages
import FormElements from "./pages/Forms/FormElements";
import FormLayout from "./pages/Forms/FormLayout";

// Table pages
import BasicTables from "./pages/Tables/BasicTables";
import DataTables from "./pages/Tables/DataTables";

// Layout and common components
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Use our new Dashboard as the main page */}
            <Route index path="/" element={<Dashboard />} />
            {/* Add routes for our new pages */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/organisations" element={<Organisations />} />
            {/* Debug: Add missing route for creating a new organisation */}
            <Route path="/organisations/new" element={<OrganisationCreate />} />
            <Route path="/organisations/:id" element={<OrganisationDetails />} />
            <Route path="/organisations/:id/edit" element={<OrganisationEdit />} />
            <Route path="/timesheets" element={<Timesheets />} />
            <Route path="/projects" element={<Projects />}>
              <Route index element={<WebsiteProjects />} />
              <Route path="website" element={<WebsiteProjects />} />
              <Route path="app" element={<AppProjects />} />
              <Route path="graphics" element={<GraphicsProjects />} />
              <Route path="seo" element={<SeoProjects />} />
              <Route path="content" element={<ContentProjects />} />
            </Route>
            <Route path="/clients" element={<Clients />} />
            <Route path="/websites" element={<Websites />} />
            <Route path="/websites/create" element={<WebsiteCreate />} />
            <Route path="/websites/:websiteId" element={<WebsiteDetails />} />
            <Route path="/websites/edit/:websiteId" element={<WebsiteEdit />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/events" element={<Events />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/create" element={<LeadCreate />} />
            <Route path="/leads/:leadId" element={<LeadView />} />
            <Route path="/leads/:leadId/edit" element={<LeadEdit />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/new" element={<ContactCreate />} />
            <Route path="/contacts/:id" element={<ContactView />} />
            <Route path="/contacts/:id/edit" element={<ContactEdit />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/create" element={<QuoteCreate />} />
            <Route path="/quotes/:quoteId" element={<QuoteView />} />
            <Route path="/quotes/:quoteId/edit" element={<QuoteEdit />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/ecommerce" element={<Ecommerce />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/crm" element={<Crm />} />
            <Route path="/stocks" element={<Stocks />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/invoice" element={<Invoices />} />
            <Route path="/faq" element={<Faqs />} />
            <Route path="/pricing-tables" element={<PricingTables />} />
            <Route path="/settings" element={<DropdownLists />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/form-layout" element={<FormLayout />} />

            {/* Applications */}
            <Route path="/chat" element={<Chats />} />

            <Route path="/task-list" element={<TaskList />} />
            <Route path="/task-kanban" element={<TaskKanban />} />
            <Route path="/file-manager" element={<FileManager />} />

            {/* Email */}
            <Route path="/inbox" element={<EmailInbox />} />
            <Route path="/inbox-details" element={<EmailDetails />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/data-tables" element={<DataTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/breadcrumb" element={<BreadCrumb />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/buttons-group" element={<ButtonsGroup />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/carousel" element={<Carousel />} />
            <Route path="/dropdowns" element={<Dropdowns />} />
            <Route path="/images" element={<Images />} />
            <Route path="/links" element={<Links />} />
            <Route path="/list" element={<Lists />} />
            <Route path="/modals" element={<Modals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/pagination" element={<Pagination />} />
            <Route path="/popovers" element={<Popovers />} />
            <Route path="/progress-bar" element={<Progressbar />} />
            <Route path="/ribbons" element={<Ribbons />} />
            <Route path="/spinners" element={<Spinners />} />
            <Route path="/tabs" element={<Tabs />} />
            <Route path="/tooltips" element={<Tooltips />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/pie-chart" element={<PieChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/two-step-verification"
            element={<TwoStepVerification />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/success" element={<Success />} />
          <Route path="/five-zero-zero" element={<FiveZeroZero />} />
          <Route path="/five-zero-three" element={<FiveZeroThree />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </Router>
    </>
  );
}

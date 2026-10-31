import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from './ProtectedRoutes';
import ProtectedApp from "./ProtectAPP";

// Import Various Pages
import LandingPage from '../Pages/LandingPage';
import LoginRegister from "../Pages/LoginRegister";
import Login from "../components/common/LoginForm";
import Register from "../components/common/SignUpForm";
import ForgotPassword from "../components/common/ForgotPassword";

// Import Dashboard Components
import NGODashboard from "../Pages/NGODashboard";
import DonarDashboard from "../Pages/DonarDashboard";

// Donar Dashboard Components
import DonarDash from "../Dashboard/Donar/Dashboard";
import NewDonations from "../Dashboard/Donar/Donations/NewDonations";
import MyDonations from "../Dashboard/Donar/Donations/MyDonations";
import DonationForm from "../Dashboard/Donar/Donations/DonationForm";
import Notification from "../Dashboard/Donar/Notification";
import Reviewdonar from "../Dashboard/Donar/Reviewdonar";
import Donationactivity from "@/Dashboard/Donar/Donations/Donationactivity";


// Import NGO Components
import NGODash from '../Dashboard/ngo/Dashboard';
import AvailableDonations from "../Dashboard/ngo/AvailableDonations";
import Donations from "../Dashboard/ngo/Donations/MyDonations";
import TrackDonations from "../Dashboard/ngo/Donations/TrackDonations";
import Donor from "@/Dashboard/ngo/Donor";
import Provider from "../Dashboard/ngo/Provider";

import Profile from '../Dashboard/common/Profile';
import Review from "../Dashboard/ngo/Review";
import Contact from "../Dashboard/common/Contact";
import LegalPage from "../Pages/LegalPage";
import NotFoundPage from "../Pages/NotFoundPage";
import AdminLogin from "../admin/AdminLogin";
import AdminConsole from "../admin/AdminConsole";
import AdminOverview from "../admin/AdminOverview";
import AdminPlaceholder from "../admin/AdminPlaceholder";

function App(){

  return (
      <Routes>
        <Route element={<ProtectedApp />}>
            <Route index element={<LandingPage />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminConsole />}>
              <Route index element={<AdminOverview />} />
              <Route path="ngo-requests" element={<AdminPlaceholder />} />
              <Route path="users" element={<AdminPlaceholder />} />
              <Route path="donations" element={<AdminPlaceholder />} />
              <Route path="reports" element={<AdminPlaceholder />} />
            </Route>

            <Route path="/user" element={<LoginRegister />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Register />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            </Route>

            <Route element={<ProtectedRoutes allowedRoles={["NGO"]} />}>
                <Route path="/user/NGO" element={<NGODashboard />}>
                    <Route index element={<NGODash />} />
                    <Route path="listings" element={<AvailableDonations />} />
                    <Route path="trackdonations" element={<TrackDonations />} />
                    <Route path="donationhistory" element={<Donations />} />
                    <Route path="allDonor" element={<Donor />} />
                    <Route path="provider" element={<Provider/>}/>
                    {/* User Profiles */}
                    <Route path="id/:userId" element={<Profile />} />
                    <Route path="reviews" element={<Review />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
            </Route>
            
            <Route element={<ProtectedRoutes allowedRoles={["Donar"]} />}>
                <Route path="/user/Donar" element={<DonarDashboard />}>
                    <Route index element={<DonarDash />} />
                    <Route path='newdonation' element={<NewDonations />} />
                    <Route path='mydonations' element={<MyDonations />} />
                    <Route path='donationForm' element={<DonationForm/>}/>
                    <Route path='notification' element={<Notification/>}/>
                    <Route path='donationactivity' element={<Donationactivity/>}/>
                    {/* User Profile  */}
                    <Route path="id/:userId" element={<Profile />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="reviews" element={<Reviewdonar/>}/>
                </Route>
            </Route>

            </Route>
            <Route path="*" element={<NotFoundPage />} />

      </Routes>
 )
}

export default App;

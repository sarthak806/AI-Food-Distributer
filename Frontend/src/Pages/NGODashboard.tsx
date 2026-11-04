
import React from 'react';
import UserDashboard from './UserDashBoard';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react'; 

import { 
    LayoutDashboard,
    ListChecks,
    CalendarDays,
    Warehouse,
    BarChart3,
    Users,
    MessageSquare,
    HeartHandshake,
} from "lucide-react";


const NGODashboard: React.FC = () => {
    const {user} = useAuth();
    console.log(user);

    const NGO = {
      roleLabel: "NGO",
      navMenu: [
            {
                name: "Dashboard",
                url: "/user/NGO",
                icon: LayoutDashboard, 
            },
            {
                name: "Find Donations",
                url: "/user/NGO/listings",
                icon: ListChecks,
            },
            {
                title: "Pickup Operations",
                url: "#",
                icon: CalendarDays,
                isActive: true,
                items:[
                    {
                        title:"Pickup Schedule",
                        url:'/user/NGO/trackdonations'
                    },
                    {
                        title:"Completed Pickups",
                        url:'/user/NGO/donationhistory'
                    },
                ],
            },
            {
                title: "Community",
                url: "#",
                icon: HeartHandshake,
                isActive: false,
                items: [
                    { title: "Food Requests", url: "/user/NGO/requests" },
                    { title: "Distribution Log", url: "/user/NGO/distribution" },
                    { title: "Donor Network", url: "/user/NGO/allDonor" },
                ],
            },
            {
                name: "Inventory",
                url: "/user/NGO/inventory",
                icon: Warehouse,
            },
            {
                name: "Impact Reports",
                url: "/user/NGO/reports",
                icon: BarChart3,
            },
            {
                name: "Team & Volunteers",
                url: "/user/NGO/team",
                icon: Users,
            },
            {
                name: "Messages",
                url: "/user/NGO/messages",
                icon: MessageSquare,
            },
        ],
      };
  return (
    <>
      {
        user.isVerified ?
        <UserDashboard data={NGO}/>
        :
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className=" border shadow-sm rounded-sm  p-4 text-center max-w-md">
                {/* Warning Icon */}
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Account Not Verified
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                Your NGO account is currently not verified. Please contact support or request verification to access the dashboard.
                </p>

                {/* Action Buttons */}
                {/* <div className="flex gap-4 justify-center">
                <Button
                    onClick={() => {
                    // Add logic to request verification
                    console.log("Request Verification");
                    }}
                >
                    Request Verification
                </Button>
                <Button
                    variant="outline" // Assuming you have an outline variant
                    onClick={() => {
                    // Add logic to contact support
                    console.log("Contact Support");
                    }}
                >
                    Contact Support
                </Button>
                </div> */}
            </div>
        </div>
      }
    </>
  )
}

export default NGODashboard;
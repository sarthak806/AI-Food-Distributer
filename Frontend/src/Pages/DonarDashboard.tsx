import React from "react";
import UserDashboard from "./UserDashBoard";
import {
  Bell,
  ChefHat,
  LayoutDashboard,
} from "lucide-react";

const DonarDashboard: React.FC = () => {
  const donorNavigation = {
    navMenu: [
      {
        name: "Dashboard",
        url: "/user/Donar",
        icon: LayoutDashboard,
      },
      {
        title: "Donation",
        url: "#",
        icon: ChefHat,
        isActive: true,
        items: [
          {
            title: "New Donation",
            url: "/user/Donar/newdonation",
          },
          {
            title: "Donation Activity",
            url: "/user/Donar/donationactivity",
          },
          {
            title: "My Donations",
            url: "/user/Donar/mydonations",
          },
        ],
      },
      {
        name: "Notifications",
        url: "/user/Donar/notification",
        icon: Bell,
      },
    ],
  };

  return <UserDashboard data={donorNavigation} />;
};

export default DonarDashboard;

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import Spinner from "@/Animations/Spinner";

const ProtectedApp = () => {
  const { fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await fetchUserData();
      } catch (e) {
        // Handled in context
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedApp;
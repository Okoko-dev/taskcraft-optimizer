
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-taskace-dark text-white p-6">
      <Logo className="mb-6" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Oops! Page not found</p>
      <Button 
        className="bg-primary hover:bg-primary-dark text-white"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Index() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/home");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-500">Redirecting to home page...</p>
    </div>
  );
} 
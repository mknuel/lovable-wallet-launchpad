import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LogoHorizontal from "../assets/images/Logo_Bloackloans_Horizontal.png";

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
          // Check if user is already authenticated
          const token = localStorage.getItem("token");
          const userData = localStorage.getItem("userData");
          
          if (token && userData) {
            // User is authenticated, navigate to main
            navigate("/main", { replace: true });
          } else {
            // User is not authenticated, navigate to landing
            navigate("/landing", { replace: true });
          }
        }, 1000);
      }, [navigate]);

    return(
        <div className="w-full bg-white min-h-screen overflow-auto relative flex flex-col items-center justify-center">
            <img src={LogoHorizontal} alt="Logo" className="w-full px-8"></img>
        </div>
    );

}

export default SplashScreen;
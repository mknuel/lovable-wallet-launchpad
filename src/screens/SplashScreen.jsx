import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LogoHorizontal from "../assets/images/Logo_Bloackloans_Horizontal.png";

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
          navigate("/landing");
        }, 1000);
      }, [navigate]);

    return(
        <div className="w-full bg-white min-h-screen overflow-auto relative flex flex-col items-center justify-center">
            <img src={LogoHorizontal} alt="Logo" className="w-full px-8"></img>
        </div>
    );

}

export default SplashScreen;
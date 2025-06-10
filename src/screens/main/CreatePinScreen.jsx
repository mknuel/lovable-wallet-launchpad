
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import api from "../../utils/api";
import Header from "../../components/layout/MainHeader";
import { useTranslation } from "../../hooks/useTranslation";

const CreatePinScreen = ({ onPinCreated, onBack }) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  // Check if all PIN digits are filled
  useEffect(() => {
    const allFilled = pin.every((digit) => digit !== "");
    setIsButtonEnabled(allFilled);
  }, [pin]);

  const handleInputChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        // If current input is empty, move to previous and clear it
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pasteData)) return;

    const newPin = [...pin];
    for (let i = 0; i < Math.min(pasteData.length, 4); i++) {
      newPin[i] = pasteData[i];
    }
    setPin(newPin);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pasteData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    if (!isButtonEnabled || isLoading) return;

    setIsLoading(true);
    const pinCode = pin.join("");
    
    try {
      console.log("Creating PIN:", pinCode);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      console.log("Token exists:", !!token);
      console.log("Token preview:", token ? `${token.substring(0, 20)}...` : 'No token');
      
      const response = await api.post('/user/wallet/pincode/create', {
        appId: "blockloan-mini-app",
        pinCode: pinCode
      });

      console.log("PIN creation response:", response);

      if (response.success) {
        console.log("PIN created successfully:", response.data);
        onPinCreated();
      } else {
        console.error("PIN creation failed:", response);
        // Handle error - you might want to show an error message to user
      }
    } catch (error) {
      console.error("Error creating PIN:", error);
      console.error("Error details:", {
        status: error.status,
        message: error.message,
        data: error.data
      });
      // Handle error - you might want to show an error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white">
      {/* Header */}
       <Header
        title={t("wallet.title") || "My Wallet"}
        action={true}
      ></Header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[16px] font-['Sansation'] text-[#1D2126] leading-[1.3]">
            <span className="font-normal">
              You are requested to create your{" "}
            </span>
            <br/>
            <span className="font-bold">Wallet PIN</span>
          </p>
        </div>

        {/* PIN Label */}
        <div className="text-[16px] font-['Sansation'] text-center font-normal text-[#1D2126] mb-8">
          Enter your PIN
        </div>

        {/* PIN Input */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className={`
                  w-[60px] h-[60px] rounded-full text-center text-[20px] font-['Sansation'] font-bold
                  border-none shadow-[1px_2px_10px_1px_rgba(0,0,0,0.10)] outline-none transition-all duration-200
                  ${
                    digit
                      ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white border-transparent"
                      : "bg-white text-black border-gray-300 focus:border-[#DC2366]"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Verify Button */}
        <div className="px-4 pb-8">
          <button
            onClick={handleVerify}
            disabled={!isButtonEnabled || isLoading}
            className={`
              w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
              transition-all duration-200 flex items-center justify-center
              ${
                isButtonEnabled && !isLoading
                  ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? "CREATING..." : "VERIFY"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePinScreen;

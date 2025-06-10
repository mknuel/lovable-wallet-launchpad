
import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/layout/MainHeader";
import { useTranslation } from "../../hooks/useTranslation";

const PinEntryScreen = ({ onPinVerified, onBack, walletData, onShowCreatePin }) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [showChangePinOption, setShowChangePinOption] = useState(false);
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
    if (allFilled) {
      setError(""); // Clear error when all fields are filled
      setShowChangePinOption(false); // Hide change PIN option when typing
    }
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
    if (!isButtonEnabled || isLoading || !walletData?.data) return;

    setIsLoading(true);
    setError("");
    setShowChangePinOption(false);
    const enteredPin = pin.join("");
    
    try {
      console.log("Verifying PIN:", enteredPin);
      console.log("Against stored PIN:", walletData.data.pinCode);
      
      // Verify PIN against the stored PIN from walletData
      if (enteredPin === walletData.data.pinCode) {
        console.log("PIN verification successful");
        onPinVerified();
      } else {
        console.log("PIN verification failed");
        setError("Incorrect PIN. Please try again.");
        setShowChangePinOption(true);
        // Clear the PIN inputs
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setError("An error occurred. Please try again.");
      setShowChangePinOption(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePinClick = () => {
    onShowCreatePin();
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white">
      {/* Header */}
      <Header
        title={t("wallet.title") || "My Wallet"}
        action={true}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Lock Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M18.5455 14.6054H5.45471C4.55101 14.6054 3.81836 13.8623 3.81836 12.9457V8.29853C3.81836 3.72272 7.4887 0 12.0001 0C16.5116 0 20.1819 3.72272 20.1819 8.29853V12.9457C20.1819 13.8623 19.4492 14.6054 18.5455 14.6054ZM7.09107 11.286H16.9092V8.29853C16.9092 5.55305 14.707 3.31941 12.0001 3.31941C9.29327 3.31941 7.09107 5.55305 7.09107 8.29853V11.286Z" fill="black"/>
              <path d="M12 0V3.31941C14.7069 3.31941 16.9091 5.55305 16.9091 8.29853V11.286H12V14.6054H18.5454C19.4491 14.6054 20.1818 13.8623 20.1818 12.9457V8.29853C20.1818 3.72272 16.5114 0 12 0Z" fill="black"/>
              <path d="M22.3635 27.7716H1.63635C0.73265 27.7716 0 27.0285 0 26.1119V12.9449C0 12.0283 0.73265 11.2852 1.63635 11.2852H22.3635C23.2672 11.2852 23.9999 12.0283 23.9999 12.9449V26.1119C23.9999 27.0285 23.2672 27.7716 22.3635 27.7716Z" fill="#B53F84"/>
              <path d="M22.3636 11.2891H12V27.7755H22.3636C23.2673 27.7755 23.9999 27.0324 23.9999 26.1158V12.9488C23.9999 12.0322 23.2673 11.2891 22.3636 11.2891Z" fill="url(#paint0_linear_32069_2987)"/>
              <path d="M14.726 18.48C14.726 17.5634 13.9934 16.8203 13.0896 16.8203H10.9078C10.0041 16.8203 9.27148 17.5634 9.27148 18.48C9.27148 19.2023 9.72726 19.8152 10.3624 20.0433V20.693C10.3624 21.6096 11.095 22.3527 11.9987 22.3527C12.9024 22.3527 13.6351 21.6096 13.6351 20.693V20.0433C14.2702 19.8152 14.726 19.2023 14.726 18.48Z" fill="black" fillOpacity="0.7"/>
              <path d="M13.0909 16.8184H12V22.3507C12.9037 22.3507 13.6364 21.6076 13.6364 20.691V20.0413C14.2715 19.8133 14.7273 19.2004 14.7273 18.4781C14.7273 17.5615 13.9946 16.8184 13.0909 16.8184Z" fill="black"/>
              <defs>
                <linearGradient id="paint0_linear_32069_2987" x1="12" y1="19.6822" x2="23.9999" y2="19.6822" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#DC2366"/>
                  <stop offset="1" stopColor="#4F5CAA"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-[#E2502A] text-center mb-2 text-[14px] font-['Sansation']">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-[16px] font-['Sansation'] text-[#1D2126] leading-[1.3]">
            <span className="font-normal">
              Verify your PIN
            </span>
          </p>
        </div>

        

        {/* PIN Input */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="tel"
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
                  ${error ? "animate-pulse" : ""}
                `}
              />
            ))}
          </div>
        </div>

        {/* Change PIN Button - Only show when there's an error */}
        {showChangePinOption && (
          <div className="px-4 pb-8">
            <button
              onClick={handleChangePinClick}
              className="inline-flex items-center text-xs justify-center gap-0.5 px-2 py-1 rounded-full bg-[#FCEEEA] text-[#E2502A]
                transition-all duration-200 mx-auto"
            >
           Reset Pin Code
            </button>
          </div>
        )}

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
            {isLoading ? "VERIFYING..." : "VERIFY"}
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default PinEntryScreen;

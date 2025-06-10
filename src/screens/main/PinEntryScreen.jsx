
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
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 10H18V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V10Z" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="15" r="2" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[16px] font-['Sansation'] text-[#1D2126] leading-[1.3]">
            <span className="font-normal">
              Verify your PIN
            </span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4 text-[14px] font-['Sansation']">
            {error}
          </div>
        )}

        {/* PIN Input */}
        <div className="flex justify-center mb-8">
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

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Change PIN Button - Only show when there's an error */}
        {showChangePinOption && (
          <div className="px-4 pb-8">
            <button
              onClick={handleChangePinClick}
              className="w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
                bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90
                transition-all duration-200"
            >
              CREATE NEW PIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinEntryScreen;

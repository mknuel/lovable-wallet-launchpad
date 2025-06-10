
import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/layout/MainHeader";
import { useTranslation } from "../../hooks/useTranslation";
import api from "../../utils/api";

const PinEntryScreen = ({ onPinVerified, onBack, walletData, onShowCreatePin }) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
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
        // Clear the PIN inputs
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setError("An error occurred. Please try again.");
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

        {/* Create PIN Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleChangePinClick}
            className="w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
              bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90
              transition-all duration-200"
          >
            CREATE
          </button>
        </div>

        {/* Numeric Keypad */}
        <div className="px-4 pb-8">
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {/* Numbers 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => {
                  const firstEmptyIndex = pin.findIndex(digit => digit === "");
                  if (firstEmptyIndex !== -1) {
                    handleInputChange(firstEmptyIndex, num.toString());
                  }
                }}
                disabled={isLoading}
                className="h-16 rounded-lg bg-gray-100 text-[24px] font-['Sansation'] font-bold text-black
                  hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            
            {/* Zero and Delete */}
            <div></div> {/* Empty space */}
            <button
              onClick={() => {
                const firstEmptyIndex = pin.findIndex(digit => digit === "");
                if (firstEmptyIndex !== -1) {
                  handleInputChange(firstEmptyIndex, "0");
                }
              }}
              disabled={isLoading}
              className="h-16 rounded-lg bg-gray-100 text-[24px] font-['Sansation'] font-bold text-black
                hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={() => {
                const lastFilledIndex = pin.map((digit, index) => digit !== "" ? index : -1)
                  .filter(index => index !== -1).pop();
                if (lastFilledIndex !== undefined) {
                  handleInputChange(lastFilledIndex, "");
                }
              }}
              disabled={isLoading}
              className="h-16 rounded-lg bg-gray-100 flex items-center justify-center
                hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 11V17" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 11V17" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 7H20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 7H12H18V6C18 4.89543 17.1046 4 16 4H8C6.89543 4 6 4.89543 6 6V7Z" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinEntryScreen;

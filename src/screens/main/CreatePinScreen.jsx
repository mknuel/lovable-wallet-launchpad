
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const CreatePinScreen = ({ onPinCreated, onBack }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

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

  const handleVerify = () => {
    if (isButtonEnabled) {
      console.log("PIN created:", pin.join(""));
      onPinCreated();
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-1"
        >
          <ArrowLeft size={20} color="#171717" />
        </button>

        <h1 className="text-[16px] font-['Sansation'] text-[#171717] font-normal">
          My Wallet
        </h1>

        <div className="flex flex-col gap-2">
          <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
          <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
          <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[16px] font-['Sansation'] text-[#1D2126] leading-[1.3]">
            <span className="font-normal">
              You are requested to create your{" "}
            </span>
            <span className="font-bold">Wallet PIN</span>
          </p>
        </div>

        {/* PIN Label */}
        <div className="text-[16px] font-['Sansation'] font-normal text-[#1D2126] mb-8">
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
                className={`
                  w-[60px] h-[60px] rounded-full text-center text-[20px] font-['Sansation'] font-bold
                  border-2 outline-none transition-all duration-200
                  ${
                    digit
                      ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white border-transparent"
                      : "bg-white text-black border-gray-300 focus:border-[#DC2366]"
                  }
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
            disabled={!isButtonEnabled}
            className={`
              w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
              transition-all duration-200
              ${
                isButtonEnabled
                  ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            VERIFY
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePinScreen;

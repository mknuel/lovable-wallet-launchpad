
import React, { useState, useRef, useEffect } from "react";

const CreatePinModal = ({ onPinCreated, onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-[372px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="flex items-center justify-center p-1"
          >
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.166 5.5H11.8327"
                stroke="#171717"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0.166 5.5L5.166 10.5"
                stroke="#171717"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0.166 5.5L5.166 0.5"
                stroke="#171717"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h1 className="text-[16px] font-['Sansation'] text-[#171717] font-normal">
            Create PIN
          </h1>

          <div className="flex flex-col gap-2">
            <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
            <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
            <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col px-5 py-10 gap-10">
          {/* Title */}
          <div className="text-center">
            <p className="text-[16px] font-['Sansation'] text-[#1D2126] leading-[1.3]">
              <span className="font-normal">
                You are requested to create your{" "}
              </span>
              <span className="font-bold">Wallet PIN</span>
            </p>
          </div>

          {/* PIN Label */}
          <div className="text-[16px] font-['Sansation'] font-normal text-[#1D2126]">
            Enter your PIN
          </div>

          {/* PIN Input */}
          <div className="flex items-center relative" style={{ gap: "23px" }}>
            {pin.map((digit, index) => (
              <React.Fragment key={index}>
                <input
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
                    w-[72px] h-[50px] rounded-[25px] text-center text-[17px] font-['Sansation'] font-bold
                    shadow-[1px_2px_10px_1px_rgba(0,0,0,0.10)] border-none outline-none
                    ${
                      digit
                        ? "bg-gradient-to-r from-[#3F5CC8] to-[#E12160] text-white"
                        : "bg-white text-black"
                    }
                  `}
                />
                {index < 3 && <div className="w-px h-[26px] bg-[#707070]"></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Verify Button */}
          <div className="px-4">
            <button
              onClick={handleVerify}
              disabled={!isButtonEnabled}
              className={`
                w-full h-[44px] rounded-lg text-[14px] font-['Sansation'] font-normal uppercase tracking-wide
                transition-all duration-200
                ${
                  isButtonEnabled
                    ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              CREATE PIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePinModal;

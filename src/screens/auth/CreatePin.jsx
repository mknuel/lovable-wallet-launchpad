import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePin = () => {
  const navigate = useNavigate();
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
      // Handle PIN verification logic here
      console.log("PIN entered:", pin.join(""));
      // Navigate to next screen or complete the process
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col w-full max-w-[372px] mx-auto min-h-screen bg-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center justify-center w-8 h-5">
          <span className="text-black text-[15px] font-medium font-['Roboto'] tracking-[-0.3px]">
            9:41
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Signal Bars */}
          <svg
            width="17"
            height="12"
            viewBox="0 0 17 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.1962 0.435547H15.2042C14.6564 0.435547 14.2122 0.886019 14.2122 1.4417V10.1617C14.2122 10.7174 14.6564 11.1679 15.2042 11.1679H16.1962C16.7441 11.1679 17.1882 10.7174 17.1882 10.1617V1.4417C17.1882 0.886019 16.7441 0.435547 16.1962 0.435547ZM10.5749 2.78325H11.5669C12.1148 2.78325 12.5589 3.23372 12.5589 3.78941V10.1617C12.5589 10.7174 12.1148 11.1679 11.5669 11.1679H10.5749C10.027 11.1679 9.5829 10.7174 9.5829 10.1617V3.78941C9.5829 3.23372 10.027 2.78325 10.5749 2.78325ZM6.93754 5.13095H5.94554C5.39768 5.13095 4.95354 5.58142 4.95354 6.13711V10.1617C4.95354 10.7174 5.39768 11.1679 5.94554 11.1679H6.93754C7.48541 11.1679 7.92954 10.7174 7.92954 10.1617V6.13711C7.92954 5.58142 7.48541 5.13095 6.93754 5.13095ZM2.30822 7.14326H1.31622C0.768352 7.14326 0.324219 7.59374 0.324219 8.14942V10.1617C0.324219 10.7174 0.768352 11.1679 1.31622 11.1679H2.30822C2.85609 11.1679 3.30022 10.7174 3.30022 10.1617V8.14942C3.30022 7.59374 2.85609 7.14326 2.30822 7.14326Z"
              fill="black"
            />
          </svg>
          {/* WiFi */}
          <svg
            width="15"
            height="12"
            viewBox="0 0 15 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.5 2.38901C9.69821 2.3891 11.8123 3.24578 13.4054 4.78198C13.5253 4.90058 13.7171 4.89909 13.8352 4.77863L14.982 3.60478C15.0418 3.54368 15.0752 3.46093 15.0747 3.37482C15.0742 3.28871 15.0399 3.20635 14.9793 3.14597C10.798 -0.918449 4.20139 -0.918449 0.020016 3.14597C-0.0406234 3.20631 -0.0750128 3.28864 -0.0754907 3.37475C-0.0759686 3.46086 -0.0427589 3.54364 0.0170155 3.60478L1.16414 4.77863C1.28222 4.89927 1.47405 4.90077 1.59395 4.78198C3.18732 3.24568 5.30157 2.389 7.5 2.38901Z"
              fill="black"
            />
            <path
              d="M7.5 6.20804C8.70767 6.20797 9.87237 6.66329 10.7676 7.48553C10.8887 7.60223 11.0795 7.5997 11.1975 7.47983L12.3429 6.30598C12.4033 6.24441 12.4367 6.16088 12.4359 6.07408C12.435 5.98729 12.3999 5.90447 12.3383 5.84415C9.61211 3.27202 5.39019 3.27202 2.66397 5.84415C2.60237 5.90447 2.56726 5.98733 2.56647 6.07415C2.56569 6.16097 2.59926 6.24449 2.65973 6.30598L3.80481 7.47983C3.92284 7.5997 4.11365 7.60223 4.23472 7.48553C5.12933 6.66383 6.29298 6.20855 7.5 6.20804Z"
              fill="black"
            />
            <path
              d="M9.79454 8.77759C9.79624 8.86463 9.76252 8.94854 9.70131 9.00952L7.71994 11.0376C7.66185 11.0972 7.58264 11.1307 7.5 11.1307C7.41736 11.1307 7.33815 11.0972 7.28006 11.0376L5.29843 9.00952C5.23722 8.9485 5.20348 8.86456 5.20522 8.77752C5.20696 8.69048 5.24414 8.60806 5.30785 8.54971C6.57337 7.46418 8.42663 7.46418 9.69215 8.54971C9.75586 8.6081 9.79284 8.69055 9.79454 8.77759Z"
              fill="black"
            />
          </svg>
          {/* Battery */}
          <div className="w-[67px] h-3 relative">
            <svg
              width="67"
              height="12"
              viewBox="0 0 67 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.35"
                d="M44.9854 0.599609H61.4756C62.6722 0.599609 63.6426 1.56999 63.6426 2.7666V8.83594C63.6426 10.0326 62.6722 11.0029 61.4756 11.0029H44.9854C43.7887 11.0029 42.8184 10.0326 42.8184 8.83594V2.7666L42.8291 2.54492C42.94 1.45226 43.8634 0.599609 44.9854 0.599609Z"
                stroke="black"
              />
              <path
                opacity="0.4"
                d="M65.1348 3.78906V7.81369C65.9331 7.47283 66.4522 6.67989 66.4522 5.80138C66.4522 4.92287 65.9331 4.12993 65.1348 3.78906Z"
                fill="black"
              />
              <path
                d="M44.3027 3.44466C44.3027 2.70828 44.8997 2.11133 45.6361 2.11133H60.8254C61.5618 2.11133 62.1587 2.70828 62.1587 3.44466V8.15649C62.1587 8.89287 61.5618 9.48982 60.8254 9.48982H45.6361C44.8997 9.48982 44.3027 8.89286 44.3027 8.15649V3.44466Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <button
          onClick={handleBackClick}
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
          My Wallet
        </h1>

        <div className="flex flex-col gap-2">
          <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
          <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
          <div className="w-1 h-1 bg-[#6C6C6C] rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 py-10 gap-10">
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

        {/* Spacer */}
        <div className="flex-1"></div>

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
            VERIFY
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;

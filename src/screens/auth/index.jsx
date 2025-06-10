/* eslint-disable no-unused-vars */
import LogoVertical from "../../assets/images/Logo - Blockloans.png";
import CommonButton from "../../components/Buttons/CommonButton";
import { PATH_MAIN, PATH_CREATE_PIN } from "../../context/paths";
import ThirdwebConnectButton from "../../components/thirdweb/ThirdwebConnectButton";
import {
  TonConnectUI,
  TonConnectButton,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CustomTonConnectButton from "../../components/Buttons/CustomTonConnectButton";

const Auth = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const tonWallet = useTonWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (tonWallet) {
      // US-2.3: Redirect to Main Menu after wallet connection
      navigate(PATH_MAIN);
    }
  }, [tonWallet, navigate]);

  const handleConnect = () => {
    tonConnectUI.openModal({
      returnStrategy: "back",
      redirectUrl: "https://blockloan-mini-app.vercel.app/main",
    });
  };

  const handleCreateWallet = () => {
    // US-2.3: Redirect to Main Menu after wallet creation
    navigate(PATH_MAIN);
  };

  return (
    <div className="container justify-around">
      <img
        src={LogoVertical}
        alt="Logo"
        className="w-[160px] h-auto pt-[34px]"
      ></img>
      <div className="text-container">
        <div className="title-container">
          <div className="title-text font-bold text-center">
            Buy & Sell Crypto in
          </div>
          <div className="title-text font-bold text-center">one app</div>
        </div>
        <div className="description-text text-center">
          It's easier to make cryptocurrency transactions in your hand, wherever
          and whenever.
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-[16px] w-full">
        <ThirdwebConnectButton
          darkMode={document.body.classList.contains("dark-mode")}
          path={PATH_MAIN}
        />
        <CustomTonConnectButton />
        <CommonButton height="48px" width="312px" onClick={handleCreateWallet}>
          CREAT A NEW WALLET
        </CommonButton>
        <CommonButton
          height="48px"
          width="312px"
          onClick={() => navigate(PATH_CREATE_PIN)}
        >
          CREATE PIN (Demo)
        </CommonButton>
      </div>
    </div>
  );
};

export default Auth;

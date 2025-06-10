/* eslint-disable react-hooks/exhaustive-deps */
import OnboardingHeader from "../../components/layout/OnboardingHeader";
import CommonButton from "../../components/Buttons/CommonButton";
import { useNavigate } from "react-router-dom";
import { PATH_SETTING } from "../../context/paths";
import { useWalletAccount } from "../../context/WalletAccountContext";

import { client } from "../../components/thirdweb/thirdwebClient";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { lightTheme } from "thirdweb/react";

import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

import ThirdwebLogo from "../../assets/images/Logo - Thirdweb - Color.png";
import ThirdwebConnect from "../../assets/images/thirdweb_connect.png";
import GoogleLogo from "../../assets/images/Google Logo.png";
import FacebookLogo from "../../assets/images/Facebook Logo.png";
import AppleLogo from "../../assets/images/Apple Logo.png";
import FooterLogo from "../../assets/images/Logo - ThirdWeb.png";
import { useEffect } from "react";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { currentWalletAccount, changeWalletAccount } = useWalletAccount();

  const handleConnect = (wallet) => {
    changeWalletAccount(wallet.getAccount().address);
    console.log("address=======>", wallet.getAccount());
    // navigate(PATH_SETTING);
  };

  useEffect(() => {
    if (currentWalletAccount) {
      // navigate(PATH_SETTING);
    }
  }, []);

  return (
    <div className="container justify-between">
      <div className="flex flex-col w-full">
        <OnboardingHeader step={0}></OnboardingHeader>
        <div className="w-full flex flex-col justify-center items-center pt-[14px] pb-[24px]">
          <img
            src={ThirdwebLogo}
            alt="Logo"
            className="w-[179px] f-[41px]"
          ></img>
          <div className="description-text">
            The fastest way to build web3 apps.
          </div>
        </div>
        <div className="w-full flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[8px] px-[17px]">
            <img
              src={ThirdwebConnect}
              alt="Logo"
              className="w-[85px] h-[18px]"
            ></img>
            <div className="flex flex-row justify-between">
              <Button
                variant="outlined"
                startIcon={<img src={GoogleLogo} alt="Goolge Logo"></img>}
                sx={{
                  "& .MuiButton-startIcon": {
                    margin: 0, // Removes MUI's default icon spacing
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  borderColor: "#DADADA",
                  borderRadius: "8px",
                  width: "28%",
                  height: "44px",
                }}
              ></Button>
              <Button
                variant="outlined"
                startIcon={<img src={FacebookLogo} alt="Goolge Logo"></img>}
                sx={{
                  "& .MuiButton-startIcon": {
                    margin: 0, // Removes MUI's default icon spacing
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  borderColor: "#DADADA",
                  borderRadius: "8px",
                  width: "28%",
                  height: "44px",
                }}
              ></Button>
              <Button
                variant="outlined"
                startIcon={<img src={AppleLogo} alt="Goolge Logo"></img>}
                sx={{
                  "& .MuiButton-startIcon": {
                    margin: 0, // Removes MUI's default icon spacing
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  borderColor: "#DADADA",
                  borderRadius: "8px",
                  width: "28%",
                  height: "44px",
                }}
              ></Button>
            </div>
          </div>
          <div className="w-full">
            <div className="font-regular text-[12px]">Email</div>
            <FormControl sx={{ width: "100%" }} variant="standard">
              <Input placeholder="Enter email" id="standard-input" />
            </FormControl>
          </div>
          <div className="flex flex-row w-full justify-between items-center gap-[8px] text-[#D6D6D6]">
            <hr className="w-full"></hr>
            <div className="font-regular text-[16px] text-[#707070]">or</div>
            <hr className="w-full"></hr>
          </div>
          <div className="flex flex-col gap-[16px]">
            {/* <CommonButton>Connect a wallet</CommonButton>
            <CommonButton>Connect as guest</CommonButton> */}
            <ConnectButton
              client={client}
              wallets={wallets}
              theme={lightTheme({
                colors: {
                  primaryButtonBg: "#DC2366",
                  primaryButtonText: "#ffffff",
                },
              })}
              connectButton={{ label: "Connect a wallet" }}
              connectModal={{ size: "compact", showThirdwebBranding: false }}
              onConnect={(wallet) => {
                handleConnect(wallet);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="text-[14px]">Powered by</div>
        <img src={FooterLogo} alt="Logo" className="w-[83px] h-[19px]"></img>
      </div>
    </div>
  );
};

export default ConnectWallet;

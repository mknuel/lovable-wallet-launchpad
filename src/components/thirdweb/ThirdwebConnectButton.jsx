
import { client, isClientAvailable } from "./thirdwebClient";
import { ConnectButton, lightTheme, darkTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

import { useNavigate } from "react-router-dom";

import { useWalletAccount } from "../../context/WalletAccountContext";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const ThirdwebConnectButton = ({ darkMode, path }) => {
  const navigate = useNavigate();

  const { changeWalletAccount } = useWalletAccount();

  const handleConnect = (wallet) => {
    changeWalletAccount(wallet.getAccount().address);
    console.log("address=======>", wallet.getAccount());
    if (path) {
      navigate(path);
    }
  };

  // If client is not available, show a message
  if (!isClientAvailable()) {
    return (
      <div className="w-[312px] h-[48px] flex items-center justify-center bg-gray-300 rounded-[50px] text-gray-600">
        Thirdweb Client ID Required
      </div>
    );
  }

  return (
    <>
      <ConnectButton
        client={client}
        wallets={wallets}
        theme={
          darkMode
            ? darkTheme({
                colors: {
                  // primaryButtonBg: "#DC2366",
                  primaryButtonText: "#ffffff",
                },
              })
            : lightTheme({
                colors: {
                  // primaryButtonBg: "#DC2366",
                  primaryButtonText: "#ffffff",
                },
              })
        }
        connectButton={{
          label: "CONNECT EXISTING WALLET",
          style: {
            width: "312px",
            height: "48px",
            background: "linear-gradient(to right, #DC2366, #4F5CAA)",
            borderRadius: "50px",
            fontFamily: "'Sansation', Arial, sans-serif",
            fontWeight: 600,
            fontSize: ""
          },
        }}
        connectModal={{ size: "compact", showThirdwebBranding: false }}
        onConnect={(wallet) => {
          handleConnect(wallet);
        }}
      />
    </>
  );
};

export default ThirdwebConnectButton;

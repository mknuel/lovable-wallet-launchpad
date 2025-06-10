import CommonButton from "./CommonButton";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { formatAddress } from "../../utils/utils";

const CustomTonConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const userTonAddress = useTonAddress();

  const handleConnect = () => {
    if (tonConnectUI.connected) {
      tonConnectUI.disconnect();
    } else {
      tonConnectUI.openModal();
    }
  };

  return (
    <CommonButton
      width="312px"
      height="48px"
      onClick={handleConnect}
    >
      {tonConnectUI.connected
        ? formatAddress(userTonAddress, 8, 4)
        : "Connect Your Ton Wallet"}
    </CommonButton>
  );
};

export default CustomTonConnectButton;

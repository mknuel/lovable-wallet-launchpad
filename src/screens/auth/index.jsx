
import LogoVertical from "../../assets/images/Logo - Blockloans.png";
import CommonButton from "../../components/Buttons/CommonButton";
import { PATH_MAIN } from "../../context/paths";
import ThirdwebConnectButton from "../../components/thirdweb/ThirdwebConnectButton";
import {
  TonConnectUI,
  TonConnectButton,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomTonConnectButton from "../../components/Buttons/CustomTonConnectButton";
import { isTMA } from "@telegram-apps/bridge";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const Auth = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const tonWallet = useTonWallet();
  const navigate = useNavigate();
  const { connect } = useConnect();
  const { login } = useAuth();
  const [authInfo, setAuthInfo] = useState("");

  useEffect(() => {
		if (tonWallet) {
			// US-2.3: Redirect to Main Menu after wallet connection
			// navigate(PATH_MAIN);
		}
	}, [tonWallet, navigate]);

	const handleConnect = () => {
		tonConnectUI.openModal({
			returnStrategy: "back",
			redirectUrl: "https://blockloan-mini-app.vercel.app/main",
		});
	};

	const handleTelegramAuth = async () => {
		setAuthInfo("");
		try {
			// Connect to in-app wallet (no modal)
			const wallet = await connect(async () => {
				const account = await inAppWallet().connect({
					client: require("../../components/thirdweb/thirdwebClient").client,
					strategy: "guest",
				});
				return account;
			});

			const acct = wallet.getAccount();
			let data = {};

			if (isTMA()) {
				const initData = retrieveLaunchParams();
				data = {
					hash: initData.tgWebAppData.hash,
					id: initData.tgWebAppData.user.id,
					username: initData.tgWebAppData.user.username,
					first_name: initData.tgWebAppData.user.firstName,
					last_name: initData.tgWebAppData.user.lastName,
					language_code: initData.tgWebAppData.user.languageCode,
					allows_write_to_pm: initData.tgWebAppData.user.allowsWriteToPm,
					photo_url: initData.tgWebAppData.user.photoUrl,
					appsChannelKey: "tg",
					deviceId: "Samsung",
					walletAddress: acct?.address,
					appId: "notTmamk",
				};
			} else {
				// Fallback for web
				data = {
					id: "tg_id_1",
					username: "username",
					first_name: "name",
					last_name: "lastname",
					language_code: "en",
					allows_write_to_pm: true,
					photo_url: "",
					appsChannelKey: "tg",
					deviceId: "Samsung",
					walletAddress: acct?.address,
					appId: "notTmamk",
				};
			}

			const postOnce = async (attempt) => {
				try {
					const response = await api.post("/ssoauth/tgregister", data);
					if (response.status === 200 && response.data?.success) {
						await login(response.data.data.token, response.data.data.user);
						navigate(PATH_MAIN);
						return true;
					}
					return false;
				} catch (err) {
					return false;
				}
			};

			let ok = await postOnce(1);
			if (!ok) {
				setAuthInfo("Sign-in hiccup, retrying once...");
				await new Promise((r) => setTimeout(r, 700));
				ok = await postOnce(2);
				setAuthInfo("");
			}
		} catch (error) {
			setAuthInfo("");
		}
	};

	const handleCreateWallet = () => {
		// navigate(PATH_MAIN);
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
        {isTMA() ? (
          <CommonButton height="48px" width="312px" onClick={handleTelegramAuth}>
            CONTINUE WITH TELEGRAM
          </CommonButton>
        ) : (
          <ThirdwebConnectButton
            darkMode={document.body.classList.contains("dark-mode")}
            path={PATH_MAIN}
          />
        )}
        <CustomTonConnectButton />
        <CommonButton height="48px" width="312px" onClick={handleCreateWallet}>
          CREATE A NEW WALLET
        </CommonButton>
        {authInfo && (
          <div className="text-[12px] text-center mt-2">{authInfo}</div>
        )}
      </div>
    </div>
  );
};

export default Auth;

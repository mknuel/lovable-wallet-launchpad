import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { WalletAccountProvider } from "./context/WalletAccountContext.jsx";
import { store } from "./store";
import "./assets/fonts/fonts.css";
import { ThirdwebProvider } from "thirdweb/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { client } from "./components/thirdweb/thirdwebClient.js";

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<LanguageProvider>
			<ThirdwebProvider client={client} autoConnect={true}>
				<WalletAccountProvider>
					<StrictMode>
						<TonConnectUIProvider manifestUrl="https://blockloan-mini-app.vercel.app/tonconnect-manifest.json">
							<BrowserRouter>
								<App />
							</BrowserRouter>
						</TonConnectUIProvider>
					</StrictMode>
				</WalletAccountProvider>
			</ThirdwebProvider>
		</LanguageProvider>
	</Provider>
);

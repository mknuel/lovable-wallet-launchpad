
import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector } from "react-redux";

const Main = () => {
    const {t} = useTranslation();
    const userData = useSelector((state) => state.user);
    
    return (
        <div className="flex flex-col h-screen w-full mx-auto bg-white">
            {/* Fixed Header */}
            <div className="flex-shrink-0">
                <Header title={t("navigation.mainMenu") || "Main Menu"} action={true} />
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                {/* Stats Card */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
                    <div className="flex justify-between items-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold">234</div>
                            <div className="text-sm opacity-90">TOKENS</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">190</div>
                            <div className="text-sm opacity-90">CRYPTO</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">715</div>
                            <div className="text-sm opacity-90">LOANS</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mb-8">
                    <button className="w-full py-4 px-6 border border-pink-300 rounded-xl text-pink-600 font-semibold bg-white">
                        MY WALLET
                    </button>
                    
                    <button className="w-full py-4 px-6 border border-pink-300 rounded-xl text-pink-600 font-semibold bg-white">
                        SETTINGS
                    </button>
                    
                    <button className="w-full py-4 px-6 border border-pink-300 rounded-xl text-pink-600 font-semibold bg-white">
                        BLOCKLOANS
                    </button>
                </div>

                {/* Next Button */}
                <button className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold">
                    NEXT
                </button>
            </div>

            {/* Fixed Navigation */}
            <div className="flex-shrink-0">
                <Navigation nav={"Main Menu"} />
            </div>
        </div>
    );
}

export default Main;

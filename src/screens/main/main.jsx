import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";

const Main = () => {
    const {t} = useTranslation();
    return (
        <div className="container">
            <Header title={t("navigation.mainMenu") || "Main Menu"} action={true}></Header>
            <div>Main Menu</div>
            <Navigation nav={"Main Menu"}></Navigation> 
        </div>
    );
}

export default Main;
import IconButton from "@mui/material/IconButton";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MessageIcon from "@mui/icons-material/Message";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { PATH_MAIN, PATH_SETTING } from "../../context/paths";

const Navigation = ({ nav }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col py-3 w-full absolute bottom-0 z-50 shadow-2xl">
      <div className="flex flex-row justify-around pb-3">
        <IconButton
          aria-label="back"
          sx={{
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            padding: 0,
          }}
          className="flex flex-col"
          onClick={() => navigate(PATH_MAIN)}
        >
          <AccountBalanceWalletIcon
            sx={{
              width: 20,
              height: 20,
              color: nav == "Main Menu" ? "#9C27B0" : "#837E7E",
            }}
            // color={nav == "Main Menu" ? "secondary" : "#837E7E"}
          />
          <div
            className="font-bold text-[14px]"
            style={{
              background:
                nav == "Main Menu"
                  ? "linear-gradient(to right, #DC2366, #4F5CAA)"
                  : "#ACB1B5",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("navigation.mainMenu") || "Main Menu"}
          </div>
        </IconButton>
        <IconButton
          aria-label="back"
          sx={{
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            padding: 0,
          }}
          className="flex flex-col"
        >
          <MessageIcon
            sx={{
              width: 20,
              height: 20,
              color: nav == "Message" ? "#9C27B0" : "#837E7E",
            }}
            // color={nav == "Message" ? "secondary" : ""}
          />
          <div
            className="font-bold text-[14px]"
            style={{
              background:
                nav == "Message"
                  ? "linear-gradient(to right, #DC2366, #4F5CAA)"
                  : "#ACB1B5",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("navigation.message") || "Message"}
          </div>
        </IconButton>
        <IconButton
          aria-label="back"
          sx={{
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            padding: 0,
          }}
          className="flex flex-col"
          onClick={() => navigate(PATH_SETTING)}
        >
          <GroupIcon
            sx={{
              width: 20,
              height: 20,
              color: nav == "Profile" ? "#9C27B0" : "#837E7E",
            }}
            // color={nav == "Profile" ? "secondary" : ""}
          />
          <div
            className="font-bold text-[14px]"
            style={{
              background:
                nav == "Profile"
                  ? "linear-gradient(to right, #DC2366, #4F5CAA)"
                  : "#ACB1B5",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("navigation.profile") || "Profile"}
          </div>
        </IconButton>
      </div>
      <hr className="w-screen text-[#EEEEEE] z-50"></hr>
    </div>
  );
};

export default Navigation;


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
    <div className="flex flex-col py-3 w-full bg-white shadow-2xl">
      <div className="flex flex-row justify-around items-center pb-3 px-4">
        <IconButton
          aria-label="back"
          sx={{
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            padding: 0,
          }}
          className="flex flex-col items-center flex-1"
          onClick={() => navigate(PATH_MAIN)}
        >
          <AccountBalanceWalletIcon
            sx={{
              width: 20,
              height: 20,
              color: nav == "Main Menu" ? "#9C27B0" : "#837E7E",
            }}
          />
          <div
            className="font-bold text-[14px] text-center"
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
          className="flex flex-col items-center flex-1"
        >
          <MessageIcon
            sx={{
              width: 20,
              height: 20,
              color: nav == "Message" ? "#9C27B0" : "#837E7E",
            }}
          />
          <div
            className="font-bold text-[14px] text-center"
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
          className="flex flex-col items-center flex-1"
          onClick={() => navigate(PATH_SETTING)}
        >
          <GroupIcon
            sx={{
              width: 20,
              height: 20,
              color: nav == "Profile" ? "#9C27B0" : "#837E7E",
            }}
          />
          <div
            className="font-bold text-[14px] text-center"
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
      <hr className="w-full text-[#EEEEEE]"></hr>
    </div>
  );
};

export default Navigation;

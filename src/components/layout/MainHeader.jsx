
import BackButton from "../Buttons/BackButton";
import IconButton from "@mui/material/IconButton";
import QrCodeIcon from "@mui/icons-material/QrCode";

const Header = ({ title, action, onBack }) => {
  return (
    <>
      <header className="w-full h-[66px] flex flex-row items-center justify-center gap-[9px] py-[18px] z-50">
        <div>
          {onBack ? (
            <button onClick={onBack} className="p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#837E7E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          ) : (
            <BackButton />
          )}
        </div>
        <h1 className="w-full text-center font-regular text-[16px]">{title}</h1>
        {action && (
          <div className="header-title flex flex-row gap-[9px]">
            <div className="w-full">
              <IconButton
                aria-label="back"
                sx={{
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  padding: 0,
                }}
                //   onClick={() => navigate(-1)}
              >
                <QrCodeIcon sx={{ width: 20, height: 20, color: "#837E7E" }} />
              </IconButton>
            </div>
            <div className="w-full">
              <IconButton
                aria-label="back"
                sx={{
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  padding: 0,
                }}
                //   onClick={() => navigate(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  color="#837E7E"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </IconButton>
            </div>
          </div>
        )}
      </header>
      <hr className="w-screen text-[#EEEEEE] z-50"></hr>
    </>
  );
};

export default Header;

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
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
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon sx={{ width: 20, height: 20, color: "#837E7E" }} />
      </IconButton>
    </div>
  );
};

export default BackButton;

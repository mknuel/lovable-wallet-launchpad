import Button from "@mui/material/Button";

// const StyledButton = styled(Button)({
//   background: "linear-gradient(to right, #DC2366, #4F5CAA)",
//   color: "white",
//   padding: "8px 24px",
//   boxShadow: "0 2px 5px 0px black blur",
//   "&:focus": {
//     outline: "none",
//     boxShadow: "none",
//   },
//   "@apply font-regular": {},
// });

const CommonButton = ({ children, ariaLabel, ...props }) => {
  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      variant="contained"
      disabled={props.disabled}
      sx={{
        fontFamily: "'Sansation', Arial, sans-serif",
        fontWeight: 600,
        borderRadius: "50px",
        width: `${props.width}`,
        height: `${props.height}`,
        background: "linear-gradient(to right, #DC2366, #4F5CAA)",
        color: "white",
        padding: "8px 24px",
        boxShadow: "0 2px 5px 0px black blur",
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
        "@apply font-regular": {},
      }}
      //   fullWidth
    >
      {children}
    </Button>
  );
};

export default CommonButton;

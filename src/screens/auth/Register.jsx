import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OnboardingHeader from "../../components/layout/OnboardingHeader";
import CommonButton from "../../components/Buttons/CommonButton";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { PATH_MAIN } from "../../context/paths";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";

import "./Register.css";

const countries = [
  { code: "US", name: "United States", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44" },
  { code: "CA", name: "Canada", phoneCode: "+1" },
  { code: "AU", name: "Australia", phoneCode: "+61" },
  { code: "DE", name: "Germany", phoneCode: "+49" },
  { code: "FR", name: "France", phoneCode: "+33" },
  { code: "JP", name: "Japan", phoneCode: "+81" },
  { code: "CN", name: "China", phoneCode: "+86" },
  { code: "IN", name: "India", phoneCode: "+91" },
  { code: "BR", name: "Brazil", phoneCode: "+55" },
];

const role = {
  id: "614c68de1df56b0018b4699c",
  name: "Engineer",
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // const [country, setCountry] = useState("");
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Also update Redux store for real-time sync
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // const handleChange = (event) => {
  //   setCountry(event.target.value);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare registration data

    const userName = "userName";
    const telegramId = "tg_id_1";
    // const userName = webApp["user"]["username"] || "userName";
    // const telegramId = webApp["user"]["id"] || "tg_id_4";

    const data = {
      id: telegramId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      roleId: role.id,
      hash: "0xhash",
      phone: formData.phone,
      password: formData.password,
      username: userName,
      appsChannelKey: "d0b9465d852a16e4ce97586e69ede763",
      deviceId: "deviceId",
      appId: "appId",
      country: formData.country,
    };
    // dispatch(setUser(data));

    try {
      api.post("/ssoauth/tgregister", data).then(async (res) => {
        if (res && res.success) {
          // US-2.1: Redirect to Main Menu after sign-up completion
          handleLogin(PATH_MAIN);
        }
      });
	} catch (error) {
		// Handle registration error silently
	}
  };

  async function handleLogin(link) {
    const userName = "userName";
    const telegramId = "tg_id_1";
    const loginData = {
      id: telegramId,
      first_name: "formData.firstName",
      deviceId: "deviceId",
      hash: "0xhash",
      username: userName,
      last_name: "formData.lastName",
    };
    await api
      .post("/ssoauth/tglogin", loginData)
      .then((response) => {
        
        if (response && response.success) {
          const userData = {
            userId: response.user._id,
            userName: response.user.userName,
            firstName: response.user.profile.firstName,
            lastName: response.user.profile.lastName,
            country: formData ? formData.country : "",
            role: response.user.roles,
            email: response.user.email,
            profileId: response.user.profile._id,
            photo: response.user.profile.photo,
            gender: "male",
          };
          login(response.token, userData);
          navigate(link);
		}
      })
	.catch((error) => {
		// Handle login error silently
	});
  }

	return (
    <div className="container justify-between">
      <div className="flex flex-col">
        <OnboardingHeader step={1}></OnboardingHeader>
        <div className="flex flex-col w-full gap-[24px]">
          <div className="font-bold text-[24px] flex justify-center items-center pb-[16px]">
            <span>Create your account</span>
          </div>
          <div>
            <div className="text-[12px]">First Name</div>
            <FormControl sx={{ width: "100%" }} variant="standard">
              <Input
                placeholder="Enter name"
                id="name-input"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div>
            <div className="text-[12px]">Last Name</div>
            <FormControl sx={{ width: "100%" }} variant="standard">
              <Input
                placeholder="Enter name"
                id="last-name-input"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div>
            <div className="text-[12px]">Phone</div>
            <FormControl sx={{ width: "100%" }} variant="standard">
              <Input
                placeholder="Enter phone number"
                id="phone-number-input"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div>
            <div className="text-[12px]">Country</div>
            <FormControl variant="standard" fullWidth>
              <Select
                labelId="country-select-label"
                id="country-select"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                label="Country"
                displayEmpty // Allows displaying a placeholder when no value is selected
                renderValue={
                  formData.country !== ""
                    ? undefined
                    : () => (
                        <span style={{ color: "#999" }}>Choose country</span>
                      )
                }
              >
                {countries.map((country) => (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <div className="text-[12px]">Password</div>
            <FormControl sx={{ width: "100%" }} variant="standard">
              <Input
                placeholder="Enter here"
                id="standard-adornment-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
          <div className="terms-container">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
                className="checkbox-input"
              />
              <span className="custom-checkbox"></span>
              <span>
                By clicking here, you are agreeing to our{" "}
                <a href="#" className="terms-link">
                  Terms & Conditions
                </a>
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[16px] items-center justify-center">
        <CommonButton
          width="310px"
          height="42px"
          onClick={handleSubmit}
          disabled={isLoading || !termsAgreed}
        >
          NEXT
        </CommonButton>
        <div className="text-[14px]">Already have an account? Log in</div>
      </div>
    </div>
  );
};

export default Register;

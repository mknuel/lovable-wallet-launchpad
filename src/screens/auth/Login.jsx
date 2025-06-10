
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import PhoneNumber from "../../components/PhoneNumber/PhoneNumber";
import Password from "../../components/Password/Password";
import CommonButton from "../../components/Buttons/CommonButton";
import OnboardingHeader from "../../components/layout/OnboardingHeader";
import api from "../../utils/api";
import { PATH_MAIN } from "../../context/paths";

import FooterLogo from "../../assets/images/Logo - ThirdWeb.png";

const LoginScreen = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare login data
      setIsSubmitting(true);

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
          console.log("Login response:", response);
          if (response && response.success) {
            const userData = {
              userId: response.user._id,
              userName: response.user.userName,
              firstName: response.user.profile.firstName,
              lastName: response.user.profile.lastName,
              country: response.user.profile.country,
              role: response.user.roles,
              email: response.user.email,
              profileId: response.user.profile._id,
              photo: response.user.profile.photo,
              gender: "male",
            };
            login(response.token, userData);
            // Redirect to Main Menu after login - not wallet
            navigate(PATH_MAIN);
          } else {
            console.error("Login failed:", response.data);
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
        });
    } catch (error) {
      // Handle error
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(phoneNumber, password);
  return (
    <>
      <div className="container justify-between">
        <div className="flex flex-col">
          <OnboardingHeader step={0}></OnboardingHeader>
          <div className="text-container w-full pt-[14px]">
            <div className="title-container">
              <div className="title-text pb-[32px]">Log in</div>
              <PhoneNumber
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
              <Password password={password} setPassword={setPassword} />
              <CommonButton
                width="310px"
                height="42px"
                onClick={handleSubmit}
                disabled={isLoading || !phoneNumber || !password}
              >
                SIGN IN
              </CommonButton>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="text-[14px]">Powered by</div>
          <img src={FooterLogo} alt="Logo" className="w-[83px] h-[19px]"></img>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;

import CommonButton from "../../components/Buttons/CommonButton";
import OnboardingHeader from "../../components/layout/OnboardingHeader";

const PhoneVerification = () => {
  return (
    <div className="container justify-between">
      <div className="flex flex-col w-full">
        <OnboardingHeader step={2}></OnboardingHeader>
        <div className="flex flex-col justify-center items-center pt-[48px]">
          <div className="text-[24px] font-bold pb-[8px] text-center">
            Enter 4 digit verification code
          </div>
          <div className="text-[14px] font-regular text-[#979899] pb-[48px] text-center">
            Code send to +9232045**** . This code will expired in 01:30
          </div>
          <div className="text-[24px] font-bold">+92</div>
        </div>
      </div>
      <CommonButton width="310px" height="42px">
        CONTINUE
      </CommonButton>
    </div>
  );
};

export default PhoneVerification;

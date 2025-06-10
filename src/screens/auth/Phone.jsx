import OnboardingHeader from "../../components/layout/OnboardingHeader";
import CommonButton from "../../components/Buttons/CommonButton";

const Phone = () => {
  return (
    <div className="container justify-between">
      <div className="flex flex-col w-full">
        <OnboardingHeader step={2}></OnboardingHeader>
        <div className="flex flex-col justify-center items-center pt-[48px]">
          <div className="text-[24px] font-bold pb-[8px]">
            Enter your number
          </div>
          <div className="text-[14px] font-regular text-[#979899] pb-[48px]">
            We will send you a verification code
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

export default Phone;

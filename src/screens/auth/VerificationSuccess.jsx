import CheckMark from "../../assets/images/Check Mark - Verification.png";
import CommonButton from "../../components/Buttons/CommonButton";

const VerificationSuccess = () => {
  return (
    <div className="container">
      <div className="flex flex-col w-full items-center gap-[26px] pt-[100px]">
        <div className="flex flex-col items-center justify-center px-[20px] gap-[24px]">
          <img
            src={CheckMark}
            alt="Checked Mark"
            className="w-[74px] h-[68px]"
          ></img>
          <div className="font-bold text-[18px]">Phone Verified!</div>
          <div className="font-regular text-[16px] text-[#616161] text-center">
            Your phone has been verified successfully!
          </div>
        </div>
        <CommonButton width="310px" height="42px">
          BACK TO LOGIN
        </CommonButton>
      </div>
    </div>
  );
};

export default VerificationSuccess;

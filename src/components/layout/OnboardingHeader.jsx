import Stepper from "./Stepper";
import BackButton from "../Buttons/BackButton";

const OnboardingHeader = ({ step }) => {
  return (
    <div className="w-full">
      {step != 0 && <Stepper progress={step}></Stepper>}
      <BackButton></BackButton>
    </div>
  );
};

export default OnboardingHeader;

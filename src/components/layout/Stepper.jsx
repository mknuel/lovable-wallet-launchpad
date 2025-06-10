const Stepper = ({ progress }) => {
  return (
    <div className="w-full relative pb-[16px]">
      <div className="w-full">
        <div
          className="h-1 rounded-full w-full"
          style={{
            background: "#F2F4F6",
          }}
        />
      </div>
      <div className="absolute top-0 left-0 w-full">
        <div
          className="h-1 rounded-full w-full"
          style={{
            background: "linear-gradient(to right, #DC2366, #4F5CAA)",
            width: `${progress * 30}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Stepper;

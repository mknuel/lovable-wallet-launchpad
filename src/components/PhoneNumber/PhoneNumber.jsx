import { useState } from "react";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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

const ariaLabel = { "aria-label": "description" };

const PhoneNumber = ({ phoneNumber, setPhoneNumber }) => {
  const [phoneError, setPhoneError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  // const [phoneNumber, setPhoneNumber] = useState(selectedCountry.phoneCode);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countries.find((c) => c.code === countryCode);
    setSelectedCountry(country);
    setPhoneNumber(country.phoneCode); // Update phone number with new country code
  };

  const validatePhone = (value) => {
    if (!value.trim()) {
      setPhoneError("Phone number is required");
      return false;
    } else if (value.length < 7) {
      setPhoneError("Phone number is too short");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handlePhoneChange = (e) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);

    // Clear error when user starts typing
    if (phoneError && value) {
      setPhoneError("");
    }
  };

  return (
    <div className="w-full">
      <div className="font-regular text-[12px]">Phone Number</div>
      <div className="flex items-stretch w-full pb-[24px]">
        <div className="w-[56px]">
          <Box>
            <FormControl variant="standard" fullWidth>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                defaultValue={"US"}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
                onChange={(e) => handleCountryChange(e)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="flex flex-grow">
          <Box
            component="form"
            sx={{ width: "100%" }}
            noValidate
            autoComplete="off"
          >
            <Input
              placeholder="Enter phone number"
              inputProps={ariaLabel}
              fullWidth
              value={phoneNumber}
              onChange={handlePhoneChange}
              onBlur={() => validatePhone(phoneNumber)}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumber;

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
import CommonButton from "../../components/Buttons/CommonButton";
import api from "../../utils/api";
import { PATH_SETTING } from "../../context/paths";
import { useTranslation } from "../../hooks/useTranslation";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";

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

const EditProfile = () => {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const [country, setCountry] = useState("");
	const [profileId, setProfileId] = useState(null);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		async function fetch() {
			await api.get("/auth/me").then((res) => {
				const data = {
					firstName: res.data.profile.firstName,
					lastName: res.data.profile.lastName,
					email: res.data.user.email,
					country: res.data.profile.country || "United States",
					password: "",
				};
				setFormData(data);
				setProfileId(res.data.profile._id);
			});
		}
		fetch();
	}, []);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		country: "",
		password: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(formData);

		await api.put(`/profile/${profileId}`, formData).then((res) => {
			navigate(PATH_SETTING);
		});
	};
	// console.log(formData);
	return (
		<div className="container">
			<Header title={t("editProfile.title") || "Edit Profile"}></Header>
			<div className="flex flex-col w-full gap-[24px] pt-[35px] pb-[105px]">
				<div>
					<div className="text-[12px]">
						{t("editProfile.firstName.label") || "First Name"}
					</div>
					<FormControl sx={{ width: "100%" }} variant="standard">
						<Input
							placeholder={t("editProfile.firstName.hint") || "Enter name"}
							id="first-name"
							name="firstName"
							value={formData.firstName}
							onChange={handleInputChange}
						/>
					</FormControl>
				</div>
				<div>
					<div className="text-[12px]">
						{t("editProfile.lastName.label") || "Last Name"}
					</div>
					<FormControl sx={{ width: "100%" }} variant="standard">
						<Input
							placeholder={t("editProfile.lastName.hint") || "Enter name"}
							id="last-name"
							name="lastName"
							value={formData.lastName}
							onChange={handleInputChange}
						/>
					</FormControl>
				</div>
				{/* <div>
          <div className="text-[12px]">Email</div>
          <FormControl sx={{ width: "100%" }} variant="standard">
            <Input
              placeholder="Enter email"
              id="email-input"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>
        </div> */}
				<div>
					<div className="text-[12px]">
						{t("editProfile.country.lable") || "Country"}
					</div>
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
											<span style={{ color: "#999" }}>
												{t("editProfile.country.hint") || "Choose country"}
											</span>
									  )
							}>
							{countries.map((country) => (
								<MenuItem key={country.name} value={country.name}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div>
					<div className="text-[12px]">
						{t("editProfile.password.label") || "Password"}
					</div>
					<FormControl sx={{ width: "100%" }} variant="standard">
						<Input
							placeholder={t("editProfile.password.label") || "Enter password"}
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
										onMouseUp={handleMouseUpPassword}>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
				</div>
			</div>
			<CommonButton width="310px" height="42px" onClick={handleSubmit}>
				{t("editProfile.button") || "SUBMIT"}
			</CommonButton>
			<Navigation nav="Profile"></Navigation>
		</div>
	);
};

export default EditProfile;

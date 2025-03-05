import { useEffect, useState } from "react";
import {
	User,
	Mail,
	Phone,
	// Calendar,
	MapPin,
	Lock,
	Edit2,
	Save,
	SquareX,
	EyeOff,
	Eye,
} from "lucide-react";
import axios from "axios";
import Loading from "../Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [messageConfirmPassword, setMessageConfirmPassword] = useState("");
	const [modalType, setModalType] = useState("success"); // success or error
	const [showPassword, setShowPassword] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [password, setPassword] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchUserInfo = async () => {
			const userId = localStorage.getItem("userId");
			const token = localStorage.getItem("token");
			try {
				const repsponse = await axios.get(
					`Auth/profile?userId=${userId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setUserInfo(repsponse.data);
			} catch (error) {
				console.error("Lỗi khi lấy thông tin người dùng:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserInfo();
	}, []);

	console.log("userInfo", userInfo);

	useEffect(() => {
		if (showModal) {
			const timer = setTimeout(() => {
				setShowModal(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showModal]);

	if (loading) {
		<Loading />;
	}

	// console.log(userInfo);

	const handleInfoChange = (e) => {
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	};

	const handlePasswordChange = (e) => {
		setPassword({ ...password, [e.target.name]: e.target.value });
	};

	const handleSubmitUser = async (e) => {
		e.preventDefault();
		try {
			// const token = localStorage.getItem("token");
			await axios.put(`/Auth/${userInfo.id}`, userInfo, {
				headers: { Authorization: `Bearer ${token}` },
			});
		} catch (error) {
			console.error("Lỗi khi cập nhật thông tin người dùng:", error);
		}
		setIsEditing(false);
		setShowPasswordChange(false);
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();

		if (password.new !== password.confirm) {
			toast.warning("Mật khẩu xác nhận không khớp.", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			setPassword({ current: "", new: "", confirm: "" });
			return;
		}

		try {
			console.log("currentPassword", password.current);
			console.log("newPassword", password.new);

			await axios.put(
				`/Auth/change-password`,
				{
					currentPassword: password.current,
					newPassword: password.new,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			// Show success modal instead of alert
			setModalType("success");
			setMessageConfirmPassword("Đổi mật khẩu thành công!");
			setShowModal(true);
			setPassword({ current: "", new: "", confirm: "" });
		} catch (error) {
			console.error("Lỗi khi đổi mật khẩu:", error);
			// Show error modal instead of alert
			setModalType("error");
			setMessageConfirmPassword(
				"Bạn đang nhập sai mật khẩu cũ hoặc mật khẩu mới không hợp lệ (chữ cái hoa, số, ký hiệu)!"
			);
			setShowModal(true);
			setPassword({ current: "", new: "", confirm: "" });
		}
		setIsEditing(false);
		setShowPasswordChange(false);
	};

	const toggleShowPassword = (field) => {
		setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 mb-8 bg-white rounded-lg shadow-md">
			<ToastContainer />
			{/* Password Change Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center z-50">
					<div
						className={`bg-white rounded-md shadow-lg w-80 overflow-hidden ${
							modalType === "success"
								? "border-green-500"
								: "border-red-500"
						} border-t-4`}
					>
						<div className="p-4">
							<div className="flex items-center mb-2">
								{modalType === "success" ? (
									<div className="bg-green-100 p-1.5 rounded-full mr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-green-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								) : (
									<div className="bg-red-100 p-1.5 rounded-full mr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-red-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</div>
								)}
								<h3 className="text-base font-medium">
									{modalType === "success"
										? "Thành công"
										: "Lỗi"}
								</h3>
							</div>
							<p className="text-sm text-gray-700 mb-3">
								{messageConfirmPassword}
							</p>
							<div className="flex justify-end">
								<button
									onClick={() => setShowModal(false)}
									className={`px-3 py-1.5 text-sm text-white rounded ${
										modalType === "success"
											? "bg-green-500 hover:bg-green-600"
											: "bg-red-500 hover:bg-red-600"
									}`}
								>
									Đóng
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
			<form
				onSubmit={
					showPasswordChange ? handleChangePassword : handleSubmitUser
				}
			>
				<div className="space-y-5">
					<div className="flex items-center">
						<User className="w-6 h-6 mr-2" />
						<label className="w-32">Tên đăng nhập:</label>
						<input
							type="text"
							name="userName"
							value={userInfo?.userName || ""}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
					<div className="flex items-center">
						<Mail className="w-6 h-6 mr-2" />
						<label className="w-32">Email:</label>
						<input
							type="email"
							name="email"
							value={userInfo?.email || ""}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
					<div className="flex items-center">
						<User className="w-6 h-6 mr-2" />
						<label className="w-32">Họ và tên:</label>
						<input
							type="text"
							name="fullName"
							value={userInfo?.fullName || ""}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
					<div className="flex items-center">
						<Phone className="w-6 h-6 mr-2" />
						<label className="w-32">Số điện thoại:</label>
						<input
							type="tel"
							name="phoneNumber"
							value={userInfo?.phoneNumber || ""}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
					<div className="flex items-center">
						<MapPin className="w-6 h-6 mr-2" />
						<label className="w-32">Địa chỉ:</label>
						<input
							type="text"
							name="address"
							value={userInfo?.address || ""}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
				</div>

				{showPasswordChange && (
					<div className="mt-6 space-y-4">
						<h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
						{["current", "new", "confirm"].map((field, index) => (
							<div className="flex items-center" key={index}>
								<Lock className="w-6 h-6 mr-2" />
								<label className="w-32">
									{field === "current"
										? "Mật khẩu hiện tại"
										: field === "new"
										? "Mật khẩu mới"
										: "Xác nhận mật khẩu"}
								</label>
								<div className="relative flex-1">
									<input
										type={
											showPassword[field]
												? "text"
												: "password"
										}
										name={field}
										value={password[field]}
										onChange={handlePasswordChange}
										className="w-full p-2 border rounded"
										required
									/>
									<button
										type="button"
										onClick={() =>
											toggleShowPassword(field)
										}
										className="absolute right-3 top-2.5"
									>
										{showPassword[field] ? (
											<Eye size={20} />
										) : (
											<EyeOff size={20} />
										)}
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<div className="mt-6 space-x-4">
					{!isEditing && !showPasswordChange && (
						<button
							type="button"
							onClick={() => setIsEditing(true)}
							className="px-4 py-2 bg-[#2193B0] text-white rounded cursor-pointer hover:bg-[#2193b0c6] transition-colors"
						>
							<Edit2 className="w-4 h-4 inline-block mr-2" />
							Chỉnh sửa thông tin
						</button>
					)}
					{!showPasswordChange && !isEditing && (
						<button
							type="button"
							onClick={() => setShowPasswordChange(true)}
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
						>
							<Lock className="w-4 h-4 inline-block mr-2" />
							Đổi mật khẩu
						</button>
					)}
					{(isEditing || showPasswordChange) && (
						<div>
							<button
								type=""
								className="px-4 py-2 bg-blue-500 text-white mr-2 rounded hover:bg-blue-600 cursor-pointer"
								onClick={() => {
									setPassword({
										current: "",
										new: "",
										confirm: "",
									});
									setIsEditing(false);
									setShowPasswordChange(false);
								}}
							>
								<SquareX className="w-4 h-4 inline-block mr-2" />
								Hủy
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
								// onClick={handleSubmit}
							>
								<Save className="w-4 h-4 inline-block mr-2" />
								Lưu thay đổi
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default Profile;

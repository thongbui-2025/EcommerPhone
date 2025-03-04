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
} from "lucide-react";
import axios from "axios";
import Loading from "../Loading";

const Profile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	// const [[messageConfirmPassword, setMessageConfirmPassword]] = useState("");
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
			alert("Mật khẩu xác nhận không khớp");
			setPassword({ current: password.current, new: "", confirm: "" });
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
		} catch (error) {
			console.error("Lỗi khi cập nhật mật khẩu:", error);
			alert("Lỗi khi cập nhật mật khẩu:");
			setPassword({ current: "", new: "", confirm: "" });
		}
		setIsEditing(false);
		setShowPasswordChange(false);
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 mb-8 bg-white rounded-lg shadow-md">
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
						<div className="flex items-center">
							<Lock className="w-6 h-6 mr-2" />
							<label className="w-32">Mật khẩu hiện tại:</label>
							<input
								type="password"
								name="current"
								value={password.current}
								required
								onChange={handlePasswordChange}
								className="flex-1 p-2 border rounded"
							/>
						</div>
						<div className="flex items-center">
							<Lock className="w-6 h-6 mr-2" />
							<label className="w-32">Mật khẩu mới:</label>
							<input
								type="password"
								name="new"
								required
								value={password.new}
								onChange={handlePasswordChange}
								className="flex-1 p-2 border rounded"
							/>
						</div>
						<div className="flex items-center">
							<Lock className="w-6 h-6 mr-2" />
							<label className="w-32">Xác nhận mật khẩu:</label>
							<input
								type="password"
								name="confirm"
								required
								value={password.confirm}
								onChange={handlePasswordChange}
								className="flex-1 p-2 border rounded"
							/>
						</div>
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

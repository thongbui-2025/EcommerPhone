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
} from "lucide-react";
import axios from "axios";

const Profile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [password, setPassword] = useState({
		current: "",
		new: "",
		confirm: "",
	});

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
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#52cceb]"></div>
			</div>
		);
	}

	// console.log(userInfo);

	const handleInfoChange = (e) => {
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	};

	const handlePasswordChange = (e) => {
		setPassword({ ...password, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// const token = localStorage.getItem("token");
			await axios.put(`/Auth/${userInfo.id}`, userInfo);
		} catch (error) {
			console.error("Lỗi khi cập nhật thông tin người dùng:", error);
		}
		// console.log("New password:", password.new);
		setIsEditing(false);
		setShowPasswordChange(false);
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					<div className="flex items-center">
						<User className="w-6 h-6 mr-2" />
						<label className="w-32">Tên đăng nhập:</label>
						<input
							type="text"
							name="userName"
							value={userInfo?.userName}
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
							value={userInfo?.email}
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
							value={userInfo?.phoneNumber}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
					{/* <div className="flex items-center">
						<User className="w-6 h-6 mr-2" />
						<label className="w-32">Giới tính:</label>
						<select
							name="gender"
							value={userInfo.gender}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						>
							<option value="Nam">Nam</option>
							<option value="Nữ">Nữ</option>
							<option value="Khác">Khác</option>
						</select>
					</div> */}
					{/* <div className="flex items-center">
						<Calendar className="w-6 h-6 mr-2" />
						<label className="w-32">Ngày sinh:</label>
						<input
							type="date"
							name="birthdate"
							value={userInfo.birthdate}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div> */}
					<div className="flex items-center">
						<MapPin className="w-6 h-6 mr-2" />
						<label className="w-32">Địa chỉ:</label>
						<input
							type="text"
							name="address"
							value={userInfo?.address}
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
								value={password.confirm}
								onChange={handlePasswordChange}
								className="flex-1 p-2 border rounded"
							/>
						</div>
					</div>
				)}

				<div className="mt-6 space-x-4">
					{!isEditing && (
						<button
							type="button"
							onClick={() => setIsEditing(true)}
							className="px-4 py-2 bg-[#2193B0] text-white rounded cursor-pointer hover:bg-[#2193b0c6] transition-colors"
						>
							<Edit2 className="w-4 h-4 inline-block mr-2" />
							Chỉnh sửa thông tin
						</button>
					)}
					{!showPasswordChange && (
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
						<button
							type="submit"
							className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
						>
							<Save className="w-4 h-4 inline-block mr-2" />
							Lưu thay đổi
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default Profile;

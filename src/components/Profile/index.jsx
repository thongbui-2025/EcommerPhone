"use client";

import { useState } from "react";
import {
	User,
	Mail,
	Phone,
	Calendar,
	MapPin,
	Lock,
	Edit2,
	Save,
} from "lucide-react";

const Profile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [userInfo, setUserInfo] = useState({
		username: "user123",
		email: "user@example.com",
		phone: "0123456789",
		gender: "Nam",
		birthdate: "1990-01-01",
		address: "Hà Nội, Việt Nam",
	});
	const [password, setPassword] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const handleInfoChange = (e) => {
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	};

	const handlePasswordChange = (e) => {
		setPassword({ ...password, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the updated info to your backend
		console.log("Updated user info:", userInfo);
		console.log("New password:", password.new);
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
							name="username"
							value={userInfo.username}
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
							value={userInfo.email}
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
							name="phone"
							value={userInfo.phone}
							onChange={handleInfoChange}
							disabled={!isEditing}
							className="flex-1 p-2 border rounded"
						/>
					</div>
					<div className="flex items-center">
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
					</div>
					<div className="flex items-center">
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
					</div>
					<div className="flex items-center">
						<MapPin className="w-6 h-6 mr-2" />
						<label className="w-32">Địa chỉ:</label>
						<input
							type="text"
							name="address"
							value={userInfo.address}
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

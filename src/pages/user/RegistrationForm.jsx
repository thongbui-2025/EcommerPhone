import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";

const RegisterForm = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		username: "",
		password: "",
		confirmPassword: "",
	});

	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setMessage("Mật khẩu không khớp!");
			return;
		}

		try {
			const response = await axios.post("/Auth/register", {
				username: formData.username,
				email: formData.email,
				password: formData.password,
			});

			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", "user");
			}
			setMessage("Đăng ký thành công! Vui lòng kiểm tra email.");
			setFormData({
				fullName: "",
				email: "",
				phone: "",
				username: "",
				password: "",
				confirmPassword: "",
			});
		} catch (error) {
			console.log(error);
			setMessage("Đăng ký thất bại. Vui lòng thử lại!");
		}
	};

	return (
		<div className="min-h-screen w-full flex bg-[#39B7CD] relative overflow-hidden">
			{/* Left Section */}
			<div className="flex-1 p-8 relative text-gray-800 flex flex-col z-10">
				<div className="flex flex-col justify-center items-center h-full">
					<img
						src="/LogPhone.png"
						alt="LogPhone Logo"
						className="w-[200px] h-[200px] object-contain mb-6"
					/>

					<p className="text-lg leading-relaxed w-[40%] text-center">
						Đăng ký ngay để nhận được nhiều khuyến mãi đặc biệt
					</p>
				</div>

				<div>
					<a
						href="/"
						className="text-gray-800 inline-flex items-center mt-8 hover:opacity-80 transition-opacity"
					>
						← Trang chủ
					</a>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex-1 flex justify-center items-center p-8">
				<div className="bg-[#333333] backdrop-blur-lg p-8 rounded-lg w-full max-w-[400px]">
					<h2 className="text-white text-xl font-semibold mb-6 text-center">
						Đăng ký tài khoản
					</h2>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<input
							type="text"
							name="fullName"
							placeholder="Họ và tên"
							value={formData.fullName}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							required
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formData.email}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							required
						/>
						<input
							type="tel"
							name="phone"
							placeholder="Số điện thoại"
							value={formData.phone}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							required
						/>
						<input
							type="text"
							name="username"
							placeholder="Tên đăng nhập"
							value={formData.username}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							required
						/>
						<input
							type="password"
							name="password"
							placeholder="Mật khẩu"
							value={formData.password}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							required
						/>
						<input
							type="password"
							name="confirmPassword"
							placeholder="Xác nhận mật khẩu"
							value={formData.confirmPassword}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
							required
						/>
						<button
							type="submit"
							className="p-3 bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] hover:opacity-90 text-black rounded-md font-medium cursor-pointer transition-colors mt-2"
						>
							Đăng ký
						</button>
					</form>
					<p className="text-center mt-4 text-white">
						Đã có tài khoản?{" "}
						<Link
							to="/login"
							className="underline hover:opacity-80 transition-opacity"
						>
							Đăng nhập
						</Link>
					</p>
					<p className="text-center mt-4 text-red-500">{message}</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterForm;

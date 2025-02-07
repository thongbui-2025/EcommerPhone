import { useState } from "react";

const LoginForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle login logic here
		console.log("Login attempt with:", formData);
	};

	return (
		<div className="min-h-screen w-full flex bg-white relative overflow-hidden">
			{/* Left Section */}
			<div className="flex-1 p-8 relative text-gray-800 flex flex-col z-10 justify-center">
				{/* White curved background */}
				<div className="absolute left-0 top-0 right-[-50%] w-full h-full bg-[#39B7CD] rounded-r-[50%] z-[-1]" />

				<div className="flex flex-col justify-center items-center h-full">
					<img
						src="/LogPhone.png"
						alt="LogPhone Logo"
						className="w-[200px] h-[200px] object-contain mb-6 mx-auto"
					/>

					<p className="text-lg leading-relaxed text-[#4F4F4F] font-bold text-center">
						LogPhone - Hân hạnh mang đến
						<br />
						sản phẩm tốt nhất cho bạn.
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
				<div className="bg-[#39B7CD] backdrop-blur-lg p-10 rounded-lg w-full max-w-[400px]">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formData.email}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
						/>
						<input
							type="password"
							name="password"
							placeholder="Mật khẩu"
							value={formData.password}
							onChange={handleChange}
							className="p-3 rounded-md border-none bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
						/>
						<button
							type="submit"
							className="p-3 bg-white text-black rounded-md font-medium hover:bg-gray-50 transition-colors"
						>
							Đăng nhập
						</button>
					</form>
					<p className="text-center mt-20 text-black">
						Chưa có mật khẩu?{" "}
						<a
							href="/registration"
							className="underline hover:opacity-80 transition-opacity"
						>
							Đăng ký
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;

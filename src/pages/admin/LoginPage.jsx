import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false); // Trạng thái loading
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true); // Bật loading khi gửi request

		try {
			const response = await axios.post("/Auth/login", {
				username: formData.email, // API yêu cầu "username" thay vì "email"
				password: formData.password,
			});

			// Nếu API trả về token hợp lệ
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", "admin");

				navigate("/productManagement"); // Chuyển hướng đến trang admin
			} else {
				setError("Đăng nhập thất bại, vui lòng thử lại.");
			}
		} catch (err) {
			if (err.response?.status === 401) {
				setError("Email hoặc mật khẩu không đúng!");
			} else {
				console.error("Lỗi khác:", err); // Chỉ log các lỗi khác ngoài 401
				setError(err.response?.data?.message || "Đã có lỗi xảy ra!");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex bg-white relative overflow-hidden">
			{/* Left Section */}
			<div className="flex-1 p-8 relative text-gray-800 flex flex-col z-10 justify-center">
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
						<button
							type="submit"
							disabled={loading} // Không cho bấm khi đang loading
							className={`p-3 rounded-md font-medium transition-colors ${
								loading
									? "bg-gray-300 cursor-not-allowed"
									: "bg-white text-black hover:bg-gray-50 cursor-pointer"
							}`}
						>
							{loading ? "Đang đăng nhập..." : "Đăng nhập"}
						</button>
						{error && (
							<p className="text-red-500 font-semibold text-sm mt-2">
								{error}
							</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

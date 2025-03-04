import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LoginForm = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const [showForgotPasswordModal, setShowForgotPasswordModal] =
		useState(false);
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
	const [forgotPasswordError, setForgotPasswordError] = useState(null);
	const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(null);
	const location = useLocation();
	const successMessage = location.state?.successMessage || "";
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

		try {
			const response = await axios.post("/Auth/login", {
				username: formData.username,
				password: formData.password,
			});

			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", "user");
				localStorage.setItem("username", response.data.username);
				localStorage.setItem("userId", response.data.userId);
				localStorage.setItem("cartId", response.data.cartId);

				navigate("/");
			} else {
				setError("Đăng nhập thất bại, vui lòng thử lại.");
			}
		} catch (err) {
			setError(
				err.response?.data?.message || "Email hoặc mật khẩu không đúng!"
			);
		}
	};

	const handleForgotPasswordSubmit = async (e) => {
		e.preventDefault();
		setForgotPasswordError(null);
		setForgotPasswordSuccess(null);

		try {
			const response = await axios.post(
				`/Auth/forgot-password?email=${forgotPasswordEmail}&url=${window.location.origin}/reset-password`
			);
			console.log(response.data);

			if (response.data.success) {
				setForgotPasswordSuccess(
					"Vui lòng kiểm tra email của bạn để đặt lại mật khẩu."
				);
				setForgotPasswordEmail("");
				setTimeout(() => {
					setShowForgotPasswordModal(false);
				}, 3000);
			} else {
				setForgotPasswordError("Có lỗi xảy ra, vui lòng thử lại sau.");
			}
		} catch (err) {
			setForgotPasswordError(
				err.response?.data?.message ||
					"Có lỗi xảy ra, vui lòng thử lại."
			);
		}
	};

	return (
		<div className="min-h-screen w-full flex bg-white relative overflow-hidden">
			{/* Left Section */}
			<div className="flex-1 p-8 relative text-gray-800 flex flex-col z-10 justify-center">
				<div className="absolute left-0 top-0 right-[-50%] w-full h-full bg-[#39B7CD] rounded-r-[50%] z-[-1]" />
				<div>
					<Link
						to="/"
						className="text-gray-800 inline-flex items-center mt-8 hover:opacity-80 transition-opacity"
					>
						← Trang chủ
					</Link>
				</div>
				<div className="flex flex-col justify-center items-center h-full">
					<Link
						to="/"
						className="text-gray-800 inline-flex items-center mt-8 hover:opacity-80 transition-opacity"
					>
						<img
							src="/LogPhone.png"
							alt="LogPhone Logo"
							className="w-[200px] h-[200px] object-contain mb-6 mx-auto"
						/>
					</Link>

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
					{successMessage && (
						<>
							<p className="bg-green-100 text-green-700 border border-green-400 rounded-lg px-4 py-2 text-center">
								{successMessage}
							</p>
							<br></br>
						</>
					)}
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<input
							type="text"
							name="username"
							placeholder="Username"
							value={formData.username}
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
							className="p-3 bg-white text-black rounded-md font-medium hover:opacity-80 cursor-pointer transition-colors"
						>
							Đăng nhập
						</button>
						{error && (
							<p className="text-red-500 font-semibold text-sm mt-2">
								{error}
							</p>
						)}

						<p className="text-center text-black">
							<button
								type="button"
								onClick={() => setShowForgotPasswordModal(true)}
								className="underline hover:opacity-80 transition-opacity"
							>
								Quên mật khẩu?
							</button>
						</p>
					</form>
					<p className="text-center mt-4 text-black">
						Chưa có tài khoản?{" "}
						<Link
							to="/registration"
							className="underline hover:opacity-80 transition-opacity"
						>
							Đăng ký
						</Link>
					</p>
				</div>
			</div>

			{/* Forgot Password Modal */}
			{showForgotPasswordModal && (
				<div className="fixed inset-0 bg-[#1e8da1] bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-8 rounded-lg w-full max-w-[400px]">
						<h2 className="text-2xl font-bold mb-4">
							Quên mật khẩu
						</h2>
						<form
							onSubmit={handleForgotPasswordSubmit}
							className="flex flex-col gap-4"
						>
							<input
								type="email"
								placeholder="Nhập email của bạn"
								value={forgotPasswordEmail}
								onChange={(e) => {
									setForgotPasswordEmail(e.target.value);
								}}
								className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="submit"
								className="p-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 cursor-pointer transition-colors"
							>
								Gửi yêu cầu
							</button>
							{forgotPasswordError && (
								<p className="text-red-500 font-semibold text-sm mt-2">
									{forgotPasswordError}
								</p>
							)}
							{forgotPasswordSuccess && (
								<p className="text-green-500 font-semibold text-sm mt-2">
									{forgotPasswordSuccess}
								</p>
							)}
						</form>
						<button
							onClick={() => setShowForgotPasswordModal(false)}
							className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
						>
							Đóng
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default LoginForm;

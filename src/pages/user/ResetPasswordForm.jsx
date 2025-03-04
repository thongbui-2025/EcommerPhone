import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const NewPasswordForm = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();

	const userId = searchParams.get("userId");
	const token = searchParams.get("token");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		// Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp nhau không
		if (newPassword !== confirmPassword) {
			setError("Mật khẩu không khớp.");
			return;
		}

		setIsLoading(true);

		try {
			const encodedToken = encodeURIComponent(token);
			const response = await axios.get(
				`/Auth/reset-password?userId=${userId}&token=${encodedToken}&newPassword=${newPassword}`
			);

			if (response.data.success) {
				setSuccess(
					"Mật khẩu đã được đổi thành công. Bạn sẽ được chuyển hướng về trang đăng nhập."
				);
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else {
				setError(
					response.data.message || "Có lỗi xảy ra, vui lòng thử lại."
				);
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Có lỗi xảy ra, vui lòng thử lại."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Nhập mật khẩu mới
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="newPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Mật khẩu mới
						</label>
						<input
							type="password"
							id="newPassword"
							name="newPassword"
							placeholder="Nhập mật khẩu mới"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Xác nhận mật khẩu mới
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							placeholder="Xác nhận mật khẩu mới"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full p-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
					>
						{isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
					</button>
					{error && (
						<p className="text-red-500 text-sm mt-2 text-center">
							{error}
						</p>
					)}
					{success && (
						<p className="text-green-500 text-sm mt-2 text-center">
							{success}
						</p>
					)}
				</form>
			</div>
		</div>
	);
};

export default NewPasswordForm;

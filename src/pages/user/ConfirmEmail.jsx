import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
	const [message, setMessage] = useState("Đang xác thực...");
	const [searchParams] = useSearchParams();

	const userId = searchParams.get("userId");
	const token = searchParams.get("token");

	useEffect(() => {
		const confirmEmail = async () => {
			if (!userId || !token) {
				setMessage("Thiếu thông tin xác thực.");
				return;
			}

			try {
				const encodedToken = encodeURIComponent(token);
				const response = await axios.get(
					`/Auth/confirm-email?userId=${userId}&token=${encodedToken}`
				);

				if (response.data.success) {
					setMessage(
						"Xác nhận email thành công! Bạn có thể đăng nhập."
					);
				} else {
					setMessage("Mã xác thực không hợp lệ.");
				}
			} catch (error) {
				setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
				console.error(error);
			}
		};

		confirmEmail();
	}, [userId, token]); // Thêm dependency để chạy lại nếu URL thay đổi

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-center text-gray-800">
					Xác thực Email
				</h2>
				<p className="text-center text-gray-700 mt-2">{message}</p>
				{message.includes("thành công") && (
					<Link
						to="/login"
						className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
					>
						Đăng nhập
					</Link>
				)}
			</div>
		</div>
	);
};

export default ConfirmEmail;

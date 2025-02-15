import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router";

const SendMail = () => {
	const [searchParams] = useSearchParams();
	const userId = searchParams.get("userId");
	const token = searchParams.get("token");
	const [message, setMessage] = useState("Đang xác nhận email...");

	useEffect(() => {
		const verify = async () => {
			try {
				await axios.get(
					`/Auth/confirm-email?userId=${userId}&token=${encodeURIComponent(
						token
					)}`
				);
				setMessage("Xác nhận email thành công! Bạn có thể đăng nhập.");
			} catch (error) {
				console.log(error);
				setMessage("Xác nhận thất bại hoặc token không hợp lệ.");
			}
		};
		verify();
	}, [userId, token]);

	return <div className="text-center">{message}</div>;
};

export default SendMail;

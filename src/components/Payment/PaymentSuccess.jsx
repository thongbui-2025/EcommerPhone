import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	// Chuyển toàn bộ params thành object để hiển thị
	const paramsObject = Object.fromEntries(searchParams.entries());
	const order = paramsObject.vnp_OrderInfo.split("_");
	const orderId = order[order.length - 1];
	axios.patch(`/Orders/updatePayment/${orderId}?isPaid=true`);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-lg rounded-2xl p-6 text-center w-96">
				<h1
					className={`text-2xl font-bold ${
						paramsObject.vnp_ResponseCode === "00"
							? "text-green-600"
							: "text-red-600"
					}`}
				>
					{paramsObject.vnp_ResponseCode === "00"
						? "Thanh toán thành công!"
						: "Thanh toán thất bại!"}
				</h1>

				<p className="mt-2 text-gray-600">
					Mã giao dịch:{" "}
					<span className="font-semibold">
						{paramsObject.vnp_TxnRef}
					</span>
				</p>

				{/* Các nút điều hướng */}
				<div className="mt-6 flex justify-center gap-4">
					<button
						onClick={() => navigate("/")}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
					>
						Về trang chủ
					</button>
					<button
						onClick={() => navigate("/purchase-history")}
						className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
					>
						Xem đơn mua
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;

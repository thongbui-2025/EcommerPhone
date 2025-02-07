"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Copy, X } from "lucide-react";

const VnPay = ({ totalAmount, onClose }) => {
	const [paymentStatus, setPaymentStatus] = useState("pending");
	const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prevCountdown) => {
				if (prevCountdown <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prevCountdown - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (countdown === 0) {
			setPaymentStatus("expired");
		}
	}, [countdown]);

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
	};

	const handleCopyClick = (text) => {
		navigator.clipboard.writeText(text).then(() => {
			alert("Đã sao chép vào clipboard");
		});
	};

	const simulatePayment = () => {
		setPaymentStatus("processing");
		setTimeout(() => {
			setPaymentStatus("success");
		}, 2000);
	};

	return (
		<div className="fixed inset-0 bg-[#2193B0] bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					<X className="w-6 h-6" />
				</button>
				<h2 className="text-2xl font-bold mb-4 text-center">
					Thanh toán qua VNPay
				</h2>

				{paymentStatus === "pending" && (
					<>
						<div className="mb-4 text-center">
							<img
								src="/placeholder.svg?height=200&width=200"
								alt="QR Code"
								className="mx-auto w-48 h-48"
							/>
							<p className="mt-2 text-sm text-gray-600">
								Quét mã QR để thanh toán
							</p>
						</div>
						<div className="space-y-2 mb-4">
							<div className="flex justify-between items-center">
								<span className="font-semibold">Số tiền:</span>
								<span>{formatPrice(totalAmount)}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="font-semibold">
									Ngân hàng:
								</span>
								<span>VNPay</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="font-semibold">
									Số tài khoản:
								</span>
								<div className="flex items-center">
									<span className="mr-2">1234567890</span>
									<button
										onClick={() =>
											handleCopyClick("1234567890")
										}
										className="text-blue-500"
									>
										<Copy className="w-4 h-4" />
									</button>
								</div>
							</div>
							<div className="flex justify-between items-center">
								<span className="font-semibold">
									Chủ tài khoản:
								</span>
								<span>NGUYEN VAN A</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="font-semibold">
									Nội dung CK:
								</span>
								<div className="flex items-center">
									<span className="mr-2">THANHTOAN123</span>
									<button
										onClick={() =>
											handleCopyClick("THANHTOAN123")
										}
										className="text-blue-500"
									>
										<Copy className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
						<div className="text-center mb-4">
							<p className="text-sm text-gray-600">
								Đơn hàng sẽ hết hạn sau:{" "}
								<span className="font-bold">
									{formatTime(countdown)}
								</span>
							</p>
						</div>
						<button
							onClick={simulatePayment}
							className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
						>
							Tôi đã thanh toán
						</button>
					</>
				)}

				{paymentStatus === "processing" && (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-lg">Đang xử lý thanh toán...</p>
					</div>
				)}

				{paymentStatus === "success" && (
					<div className="text-center py-8">
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
						<h3 className="text-xl font-bold mb-2">
							Thanh toán thành công!
						</h3>
						<p className="mb-4">
							Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử
							lý ngay.
						</p>
						<button
							onClick={onClose}
							className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
						>
							Đóng
						</button>
					</div>
				)}

				{paymentStatus === "expired" && (
					<div className="text-center py-8">
						<X className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<h3 className="text-xl font-bold mb-2">
							Đơn hàng đã hết hạn
						</h3>
						<p className="mb-4">
							Vui lòng thử lại hoặc chọn phương thức thanh toán
							khác.
						</p>
						<button
							onClick={onClose}
							className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
						>
							Đóng
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default VnPay;

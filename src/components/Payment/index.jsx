import { useState } from "react";
import { Edit2 } from "lucide-react";
import VnPay from "./VnPay";
// import { useParams } from "react-router";

const Payment = () => {
	const [selectedAddress, setSelectedAddress] = useState("default");
	const [customAddress, setCustomAddress] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [showCompletePay, setShowCompletePay] = useState(false);
	// const { cardId } = useParams("cardId");

	const [products, setProducts] = [
		// {
		// 	id: 1,
		// 	name: "iPhone 12 Mini 64GB",
		// 	image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XZb0EdamED0thuP9ud1iYqkYJsG0k4.png",
		// 	quantity: 1,
		// 	price: 30000000,
		// },
		// {
		// 	id: 2,
		// 	name: "iPhone 11 Pro Max 64GB",
		// 	image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XZb0EdamED0thuP9ud1iYqkYJsG0k4.png",
		// 	quantity: 1,
		// 	price: 20000000,
		// },
	];

	const totalAmount = products.reduce(
		(sum, product) => sum + product.price * product.quantity,
		0
	);

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
			{/* Customer Information */}
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">
					Thông tin khách hàng:
				</h2>
				<div className="space-y-2">
					<p>
						<span className="font-semibold">Họ và tên:</span> Trần
						Luân Hy
					</p>
					<p>
						<span className="font-semibold">Email:</span>{" "}
						hytranluan@gmail.com
					</p>
					<p>
						<span className="font-semibold">Điện thoại:</span>{" "}
						0765006381
					</p>
				</div>
			</div>

			{/* Delivery Address */}
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng:</h2>
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<input
							type="radio"
							id="defaultAddress"
							name="address"
							checked={selectedAddress === "default"}
							onChange={() => setSelectedAddress("default")}
							className="w-4 h-4"
						/>
						<label htmlFor="defaultAddress">Địa chỉ mặc định</label>
					</div>
					{selectedAddress === "default" && (
						<div className="ml-6 p-2 bg-gray-50 rounded">
							123 đường Mạc Thiên Tích P.11 Q.5
						</div>
					)}

					<div className="flex items-center gap-2">
						<input
							type="radio"
							id="customAddress"
							name="address"
							checked={selectedAddress === "custom"}
							onChange={() => setSelectedAddress("custom")}
							className="w-4 h-4"
						/>
						<label htmlFor="customAddress">Địa chỉ khác</label>
					</div>
					{selectedAddress === "custom" && (
						<input
							type="text"
							value={customAddress}
							onChange={(e) => setCustomAddress(e.target.value)}
							placeholder="Nhập địa chỉ khác"
							className="ml-6 w-full p-2 border rounded"
						/>
					)}
				</div>
			</div>

			{/* Payment Method */}
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">
					Hình thức thanh toán:
				</h2>
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<input
							type="radio"
							id="cash"
							name="payment"
							checked={paymentMethod === "cash"}
							onChange={() => setPaymentMethod("cash")}
							className="w-4 h-4"
						/>
						<label htmlFor="cash">
							Tiền mặt - Chỉ hỗ trợ trả tiền mặt khi nhận hàng
						</label>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="radio"
							id="vnpay"
							name="payment"
							checked={paymentMethod === "vnpay"}
							onChange={() => setPaymentMethod("vnpay")}
							className="w-4 h-4"
						/>
						<label htmlFor="vnpay">Thanh toán qua VNPay</label>
					</div>
				</div>
			</div>

			{/* Order Summary */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Đơn hàng:</h2>
					<button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500">
						<Edit2 className="w-4 h-4" />
						Sửa đổi
					</button>
				</div>
				<div className="border rounded">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="p-4 text-left">Tên sản phẩm</th>
								<th className="p-4 text-center">Số lượng</th>
								<th className="p-4 text-right">Giá</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product.id} className="border-t">
									<td className="p-4">
										<div className="flex items-center gap-4">
											<img
												src={
													product.image ||
													"/placeholder.svg"
												}
												alt={product.name}
												className="w-16 h-16 object-cover rounded"
											/>
											{product.name}
										</div>
									</td>
									<td className="p-4 text-center">
										{product.quantity}
									</td>
									<td className="p-4 text-right">
										{formatPrice(product.price)}
									</td>
								</tr>
							))}
							<tr className="border-t bg-gray-50">
								<td colSpan={2} className="p-4 font-bold">
									Cần thanh toán:
								</td>
								<td className="p-4 text-right font-bold text-red-600">
									{formatPrice(totalAmount)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Complete Order Button */}
			<button
				onClick={() => {
					if (paymentMethod === "vnpay") {
						setShowCompletePay(true);
					} else {
						// Handle cash payment or show a different component
						console.log("Order completed with:", {
							address:
								selectedAddress === "custom"
									? customAddress
									: "123 đường Mạc Thiên Tích P.11 Q.5",
							paymentMethod,
							totalAmount,
						});
					}
				}}
				className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition-colors"
			>
				HOÀN TẤT ĐẶT HÀNG
			</button>
			{showCompletePay && (
				<VnPay
					totalAmount={totalAmount}
					onClose={() => setShowCompletePay(false)}
				/>
			)}
		</div>
	);
};

export default Payment;

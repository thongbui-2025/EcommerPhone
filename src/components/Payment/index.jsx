import { useEffect, useState } from "react";
import { Edit2 } from "lucide-react";
import VnPay from "./VnPay";
import axios from "axios";

const Payment = () => {
	const [selectedAddress, setSelectedAddress] = useState("default");
	const [customAddress, setCustomAddress] = useState("");
	const [paymentMethod, setPaymentMethod] = useState(0);
	const [showCompletePay, setShowCompletePay] = useState(false);
	const [customerInfo, setCustomerInfo] = useState([]);
	// const [responsePayment, setResponsePm] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const token = localStorage.getItem("token");
	const cartId = localStorage.getItem("cartId");

	useEffect(() => {
		axios
			.get("/Auth/profile", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => setCustomerInfo(response.data))
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));

		const fetchData = async () => {
			try {
				const cartResponse = await axios.get(
					`/Cart_Item/getSelected?cartId=${cartId}`
				);
				const cartItemsData = cartResponse.data;

				if (cartItemsData.length > 0) {
					const skuResponses = await Promise.all(
						cartItemsData.map((item) =>
							axios.get(`/Product_SKU/${item.product_SKUId}`)
						)
					);

					const skuData = skuResponses.map((res) => res.data);

					const productResponses = await Promise.all(
						skuData.map((sku) =>
							axios.get(`/Products/${sku.productId}`)
						)
					);

					const productData = productResponses.map((res) => res.data);

					const enrichedCartItems = cartItemsData.map(
						(item, index) => ({
							...item,
							product_SKU: skuData[index],
							product: productData[index],
						})
					);

					setCartItems(enrichedCartItems);
				} else {
					setCartItems([]);
				}
			} catch (error) {
				console.error("Lỗi khi lấy dữ liệu:", error);
			}
		};

		if (cartId) {
			fetchData();
		}
	}, []);
	console.log(cartItems);

	const totalAmount = cartItems.reduce(
		(sum, item) =>
			sum + (item.product_SKU?.finalPrice * item.quantity || 0),
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
						<span className="font-semibold">Họ và tên:</span>{" "}
						{customerInfo.fullName}
					</p>
					<p>
						<span className="font-semibold">Email:</span>{" "}
						{customerInfo.email}
					</p>
					<p>
						<span className="font-semibold">Điện thoại:</span>{" "}
						{customerInfo.phoneNumber}
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
							{customerInfo.address}
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
							checked={paymentMethod === 0}
							onChange={() => setPaymentMethod(0)}
							className="w-4 h-4"
						/>
						<label htmlFor="cash">
							Thanh toán khi nhận hàng (COD)
						</label>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="radio"
							id="vnpay"
							name="payment"
							checked={paymentMethod === 1}
							onChange={() => setPaymentMethod(1)}
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
							{cartItems.map((item) => (
								<tr
									key={item?.product_SKU?.id}
									className="border-t"
								>
									<td className="p-4">
										<div className="flex items-center gap-4">
											{/* <img
												src={
													product.image ||
													"/placeholder.svg"
												}
												alt={product.name}
												className="w-16 h-16 object-cover rounded"
											/> */}
											<div>
												<span className="font-medium block">
													{item.product?.name ||
														"Đang tải..."}
												</span>
												<span className="text-sm text-gray-500 block">
													{item.product_SKU?.raM_ROM
														? `Bộ nhớ: ${item.product_SKU.raM_ROM}`
														: ""}
												</span>
												<span className="text-sm text-gray-500 block">
													{item.product_SKU?.color
														? `Màu: ${item.product_SKU.color}`
														: ""}
												</span>
											</div>
										</div>
									</td>
									<td className="p-4 text-center">
										{item.quantity}
									</td>
									<td className="p-4 text-right">
										{formatPrice(
											item.product_SKU?.finalPrice
										)}
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
					axios
						.post(`/Cart_Item/Purchase`, null, {
							params: {
								userId: customerInfo.id,
								cartId: cartId,
								name: customerInfo.fullName,
								phoneNumber: customerInfo.phoneNumber,
								address:
									selectedAddress === "custom"
										? customAddress
										: customerInfo.address,
								pm: paymentMethod,
							},
						})
						.then((response) => {
							if (paymentMethod === 1) {
								window.open(response.data, "_blank"); // Opens in a new window/tab
							} else {
								// Handle other payment methods here
								console.log("Other payment method selected.");
							}
						})
						.catch((error) =>
							console.error("Lỗi khi lấy dữ liệu:", error)
						);
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

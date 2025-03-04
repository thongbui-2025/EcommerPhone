import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useOutletContext } from "react-router";

const Payment = () => {
	const [selectedAddress, setSelectedAddress] = useState("default");
	const [customAddress, setCustomAddress] = useState("");
	const [paymentMethod, setPaymentMethod] = useState(0);
	const [customerInfo, setCustomerInfo] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const token = localStorage.getItem("token");
	const cartId = localStorage.getItem("cartId");

	const { state } = useLocation();
	const navigate = useNavigate();
	const buyNowProduct = state?.buyNowProduct;
	console.log(buyNowProduct);

	// const { handleSmooth } = useOutletContext();

	useEffect(() => {
		axios
			.get("/Auth/profile", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => setCustomerInfo(response.data))
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));

		const fetchData = async () => {
			if (buyNowProduct) {
				const productResponse = await axios.get(
					`/Products/${buyNowProduct.productId}`
				);
				const productData = productResponse.data;

				setCartItems([
					{
						product: productData,
						product_SKU: buyNowProduct,
						quantity: 1,
					},
				]);
			} else if (cartId) {
				try {
					const cartResponse = await axios.get(
						`/Cart_Item/getSelected?cartId=${cartId}`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
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
						const productData = productResponses.map(
							(res) => res.data
						);

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
			}
		};

		if (cartId) {
			fetchData();
		}
	}, [cartId, buyNowProduct, token]);

	console.log(cartItems);

	const totalAmount = cartItems.reduce(
		(sum, item) =>
			sum + (item.product_SKU?.finalPrice * item.quantity || 0),
		0
	);

	// const formatPrice = (price) => {
	// 	return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	// };
	const handleConfirmOrder = () => {
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
					product_SKUId: buyNowProduct?.id,
					quantity: 1,
					returnUrl: window.location.origin + "/payment-success",
				},
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				if (paymentMethod === 1) {
					window.open(response.data, "_blank");
					navigate("/purchase-history");
				} else {
					// Handle other payment methods here
					// Show success modal and then navigate to home page
					setIsModalOpen(true);
					toast.success("Đặt hàng thành công!", {
						position: "top-center",
						autoClose: 2000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						onClose: () => {
							navigate("/purchase-history");
							// setTimeout(() => {
							// 	handleSmooth();
							// }, 300);
						},
					});
					// Gửi sự kiện cập nhật giỏ hàng
					window.dispatchEvent(new Event("cartUpdated"));
				}
			})
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl p-6 bg-white rounded-lg shadow-md">
			{/* Toast Container for notifications */}
			<ToastContainer />

			{/* Success Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-t-4 border-green-500">
						<div className="flex items-center mb-4">
							<div className="bg-green-100 p-2 rounded-full mr-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-medium">
								Đặt hàng thành công
							</h3>
						</div>
						<p className="mb-4">
							Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác
							nhận và đang được xử lý.
						</p>
						<div className="flex justify-end">
							<button
								onClick={() => {
									setIsModalOpen(false);
									navigate("/");
								}}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Customer Information */}
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">
					Thông tin khách hàng:
				</h2>
				<div className="space-y-2">
					<p>
						<span className="font-semibold">Họ và tên:</span>{" "}
						{customerInfo?.fullName}
					</p>
					<p>
						<span className="font-semibold">Email:</span>{" "}
						{customerInfo?.email}
					</p>
					<p>
						<span className="font-semibold">Điện thoại:</span>{" "}
						{customerInfo?.phoneNumber}
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
				onClick={handleConfirmOrder}
				className="w-full bg-red-600 text-white py-3 rounded font-bold cursor-pointer hover:bg-red-700 transition-colors"
			>
				XÁC NHẬN ĐẶT HÀNG
			</button>
		</div>
	);
};

export default Payment;

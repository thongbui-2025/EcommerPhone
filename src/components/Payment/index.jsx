import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
	const [defaultAddress, setDefaultAddress] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState(0);
	const [customerInfo, setCustomerInfo] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [addresses, setAddresses] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);

	const token = localStorage.getItem("token");
	const cartId = localStorage.getItem("cartId");
	const userId = localStorage.getItem("userId");

	const { state } = useLocation();
	const navigate = useNavigate();
	const buyNowProduct = state?.buyNowProduct;
	console.log(buyNowProduct);

	useEffect(() => {
		axios
			.get("/Auth/profile", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => setCustomerInfo(response.data))
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));

		axios
			.get("/Address/getByUser/" + userId, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				const addresses = response.data;
				setAddresses(addresses);

				// Tìm địa chỉ có thuộc tính default = true
				const dfAddress = addresses.find(
					(address) => address.default === true
				);
				if (dfAddress) {
					setDefaultAddress(dfAddress);
				}
			})
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
	}, []);
	console.log(cartItems);
	console.log(addresses);
	console.log(defaultAddress);

	const totalAmount = cartItems.reduce(
		(sum, item) =>
			sum + (item.product_SKU?.finalPrice * item.quantity || 0),
		0
	);

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl p-6 bg-white rounded-lg shadow-md">
			{/* Toast Container for notifications */}
			<ToastContainer />
			{/* Success Modal */}
			{isModalOrderOpen && (
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
									setIsModalOrderOpen(false);
									navigate("/purchase-history");
								}}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Delivery Address */}
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
					📍 Địa Chỉ Nhận Hàng
				</h2>
				<div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
					{addresses.length > 0 ? (
						<div className="flex justify-between items-center">
							<div>
								<p className="font-semibold text-lg">
									{defaultAddress.name}{" "}
									<span className="text-gray-600">
										{" "}
										{defaultAddress.phoneNumber}
									</span>
								</p>
								<p className="text-gray-700">
									{defaultAddress.street},{" "}
									{defaultAddress.ward},{" "}
									{defaultAddress.district},{" "}
									{defaultAddress.city}
								</p>
								{defaultAddress.default && (
									<span className="text-red-600 border border-red-500 px-2 py-1 text-sm rounded-md inline-block mt-2">
										Mặc Định
									</span>
								)}
							</div>
							<button
								className="text-blue-600 hover:underline"
								onClick={() => setIsModalOpen(true)}
							>
								Thay Đổi
							</button>
						</div>
					) : (
						<div>
							Bạn chưa có địa chỉ nào nhấn vào{" "}
							<a href="/address" className="text-blue-600">
								{" "}
								đây
							</a>{" "}
							để quản lý địa chỉ.
						</div>
					)}
				</div>

				{/* Modal */}
				{isModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-96">
							<h3 className="text-lg font-semibold mb-4">
								Chọn Địa Chỉ Nhận Hàng
							</h3>
							<ul className="space-y-2">
								{addresses.map((address) => (
									<li
										key={address.id}
										className="p-2 border rounded flex justify-between items-center"
									>
										<div>
											<p className="font-semibold">
												{address.name} (
												{address.phoneNumber})
											</p>
											<p className="text-sm text-gray-600">
												{address.street}, {address.ward}
												, {address.district},{" "}
												{address.city}
											</p>
										</div>
										<button
											className="text-green-600 hover:underline"
											onClick={() => {
												console.log(
													"Chọn địa chỉ:",
													address
												);
												setDefaultAddress(address);
												setIsModalOpen(false); // Đóng modal khi chọn địa chỉ
											}}
										>
											Chọn
										</button>
									</li>
								))}
							</ul>
							<div className="mt-4 flex flex-col space-y-2">
								<button
									className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
									onClick={() => navigate("/address")}
								>
									Quản Lý Địa Chỉ
								</button>
								<button
									className="w-full py-2 bg-gray-300 rounded-lg"
									onClick={() => setIsModalOpen(false)}
								>
									Đóng
								</button>
							</div>
						</div>
					</div>
				)}
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
								name: defaultAddress.name,
								phoneNumber: defaultAddress.phoneNumber,
								address: `${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.city}`,
								pm: paymentMethod,
								product_SKUId: buyNowProduct?.id,
								quantity: 1,
							},
							headers: { Authorization: `Bearer ${token}` },
						})
						.then((response) => {
							if (paymentMethod === 1) {
								window.open(response.data, "_blank"); // Opens in a new window/tab
							} else {
								// Handle other payment methods here
								// Show success modal and then navigate to home page
								setIsModalOrderOpen(true);
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
						.catch((error) =>
							console.error("Lỗi khi lấy dữ liệu:", error)
						);
				}}
				className={`w-full py-3 rounded font-bold transition-colors ${
					addresses.length > 0
						? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
						: "bg-gray-400 text-gray-200 cursor-not-allowed"
				}`}
				disabled={addresses.length === 0}
			>
				HOÀN TẤT ĐẶT HÀNG
			</button>
		</div>
	);
};

export default Payment;

import { useEffect, useState } from "react";
import { Minus, Plus, X, ChevronLeft } from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router";
import axios from "axios";
import Loading from "../Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ShoppingCart() {
	const [cartItems, setCartItems] = useState([]);

	const userId = localStorage.getItem("userId");
	const cartId = localStorage.getItem("cartId");

	const { handleSmooth } = useOutletContext();

	const navigate = useNavigate();

	const [isLoadingCart, setIsLoadingCart] = useState(false); // Loading khi state  chưa update

	const token = localStorage.getItem("token");

	useEffect(() => {
		setIsLoadingCart(true);
		const fetchData = async () => {
			try {
				// Lấy danh sách sản phẩm trong giỏ hàng
				const cartResponse = await axios.get(
					`/Cart_Item?cartId=${cartId}`,
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
			} finally {
				setIsLoadingCart(false);
			}
		};

		if (cartId) {
			fetchData();
		}
	}, [cartId, token]); // Chỉ chạy lại khi cartId thay đổi

	const selectedItems = cartItems.filter((item) => item.isSelect);
	console.log(selectedItems);

	const toggleSelectItem = async (itemId) => {
		try {
			const updatedItem = cartItems.find((item) => item.id === itemId);
			if (!updatedItem) {
				console.error("Không tìm thấy item với id:", itemId);
				return;
			}

			const newSelectStatus = !updatedItem.isSelected;

			// Cập nhật trạng thái trong frontend
			setCartItems((prevItems) =>
				prevItems.map((item) =>
					item.id === itemId
						? { ...item, isSelected: newSelectStatus }
						: item
				)
			);

			await axios.put(
				`Cart_Item/select/${itemId}?select=${newSelectStatus}`,
				null,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		} catch (error) {
			console.error("Error updating item selection:", error);
		}
	};

	console.log(cartItems);

	const updateQuantity = async (id, change) => {
		const currentItem = cartItems.find((item) => item.id === id);
		if (!currentItem) return;

		const maxQuantity = currentItem.product_SKU.quantity;
		const newQuantity = Math.max(
			1,
			Math.min(currentItem.quantity + change, maxQuantity)
		);

		if (newQuantity === currentItem.quantity) {
			toast.info("Số lượng sản phẩm đã đạt giới hạn kho!", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		setCartItems((items) =>
			items.map((item) =>
				item.id === id ? { ...item, quantity: newQuantity } : item
			)
		);

		try {
			await axios.put(`Cart_Item/${id}?amount=${change}`, null, {
				headers: { Authorization: `Bearer ${token}` },
			});
		} catch (error) {
			console.error("Error updating quantity in backend:", error);
		}
	};

	const removeItem = async (id) => {
		setCartItems((items) => items.filter((item) => item.id !== id));
		try {
			await axios.delete(`Cart_Item/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			// Gửi sự kiện cập nhật giỏ hàng
			window.dispatchEvent(new Event("cartUpdated"));
		} catch (error) {
			console.error("Error delete in server:", error);
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	};

	// const total = cartItems.reduce(
	// 	(sum, item) => sum + item.product_SKU.finalPrice * item.quantity,
	// 	0
	// );

	const totalSelectedPrice = cartItems
		.filter((item) => item.isSelected) // Chỉ lấy những sản phẩm được chọn
		.reduce(
			(sum, item) => sum + item.product_SKU.finalPrice * item.quantity,
			0
		);

	const handleNavigateSmooth = () => {
		navigate("/");
		setTimeout(() => {
			handleSmooth();
		}, 300);
	};

	console.log("cartItems", cartItems);

	return (
		<div className={`${cartItems.length == 0 ? "mt-20" : ""}`}>
			<ToastContainer />
			{!userId ? (
				<div className="text-center text-xl text-[#3ea8c0] font-semibold">
					Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng nhé! 💖
					<br />
					<Link
						to="/login"
						onClick={handleNavigateSmooth}
						className="text-[#3ea8c0] underline hover:text-[#F92F60]"
					>
						Đăng nhập ngay
					</Link>{" "}
					để khám phá và chọn mua sản phẩm yêu thích!
				</div>
			) : isLoadingCart ? (
				<Loading />
			) : cartItems.length > 0 ? (
				<div className="container mx-auto px-4 py-8 max-w-4xl">
					<div className="bg-white rounded-lg shadow-sm p-6">
						<h1 className="text-xl font-bold mb-6">
							Chi tiết giỏ hàng
						</h1>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="border-b">
									<tr className="text-left">
										<th className="pb-4">Sản phẩm</th>
										<th className="pb-4">Số lượng</th>
										<th className="pb-4">Giá</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{cartItems.map((item) => (
										<tr key={item.id} className="text-sm">
											<td className="py-4">
												<div className="flex items-center gap-4">
													<img
														src={
															item?.product_SKU
																?.imageName
																? `https://localhost:7011/uploads/${item?.product?.id}/${item?.product_SKU?.imageName}`
																: "/productNoImage.svg"
														}
														alt={item.name}
														className="w-20 h-20 object-cover rounded-lg"
													/>
													<div>
														<span className="font-medium block">
															{item.product
																?.name ||
																"Đang tải..."}
														</span>
														<span className="text-sm text-gray-500 block">
															{item.product_SKU
																?.raM_ROM
																? `Bộ nhớ: ${item.product_SKU.raM_ROM}`
																: ""}
														</span>
														<span className="text-sm text-gray-500 block">
															{item.product_SKU
																?.color
																? `Màu: ${item.product_SKU.color}`
																: ""}
														</span>
													</div>
												</div>
											</td>
											<td className="py-4">
												<div className="flex items-center gap-2">
													<button
														onClick={() =>
															updateQuantity(
																item.id,
																-1
															)
														}
														className="p-1 hover:bg-gray-100 rounded"
													>
														<Minus className="w-4 h-4" />
													</button>
													<span className="w-8 text-center">
														{item.quantity}
													</span>
													<button
														onClick={() =>
															updateQuantity(
																item.id,
																1
															)
														}
														className="p-1 hover:bg-gray-100 rounded"
													>
														<Plus className="w-4 h-4" />
													</button>
													<button
														onClick={() =>
															removeItem(item.id)
														}
														className="p-1 hover:bg-gray-100 rounded text-red-500"
													>
														<X className="w-4 h-4" />
													</button>
												</div>
											</td>
											<td className="py-4">
												{formatPrice(
													item.product_SKU.finalPrice
												)}
											</td>
											<td className="py-4 text-right">
												<input
													type="checkbox"
													checked={
														item.isSelected || false
													}
													onChange={() =>
														toggleSelectItem(
															item.id
														)
													}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							<div className="flex justify-between items-center mt-4">
								<span className="text-lg font-bold">
									Tổng tiền:
								</span>
								<span className="text-lg font-bold text-red-600">
									{formatPrice(totalSelectedPrice)}
								</span>
							</div>
						</div>

						<div className="flex justify-between mt-6">
							<button
								onClick={handleNavigateSmooth}
								className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
							>
								<ChevronLeft className="w-4 h-4" />
								Quay lại
							</button>
							<Link to="/cart/payment-info">
								<button
									className={`px-6 py-2 rounded-lg transition-colors cursor-pointer ${
										totalSelectedPrice === 0
											? "bg-gray-400 cursor-not-allowed"
											: "bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] text-white hover:from-[#6DD5ED] hover:to-[#2193B0]"
									}`}
									disabled={totalSelectedPrice === 0}
								>
									Mua hàng
								</button>
							</Link>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center text-xl text-[#3ea8c0] font-semibold">
					Bạn chưa có sản phẩm nào trong giỏ hàng! 💖
					<br />
					<Link
						to="#"
						onClick={handleNavigateSmooth}
						className="text-[#3ea8c0] underline hover:text-[#F92F60]"
					>
						Khám phá ngay
					</Link>{" "}
					sản phẩm yêu thích và thêm vào giỏ hàng nhé!
				</div>
			)}
		</div>
	);
}

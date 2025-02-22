import { useEffect, useState } from "react";
import { Minus, Plus, X, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import axios from "axios";

export default function ShoppingCart() {
	const [cartItems, setCartItems] = useState([]);

	const cartId = localStorage.getItem("cartId");
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Lấy danh sách sản phẩm trong giỏ hàng
				const cartResponse = await axios.get(
					`/Cart_Item?cartId=${cartId}`
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
	}, [cartId]); // Chỉ chạy lại khi cartId thay đổi

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
				`Cart_Item/select/${itemId}?select=${newSelectStatus}`
			);
		} catch (error) {
			console.error("Error updating item selection:", error);
		}
	};

	console.log(cartItems);

	// const updateQuantity = (id, change) => {
	// 	setCartItems((items) =>
	// 		items.map((item) =>
	// 			item.id === id
	// 				? { ...item, quantity: Math.max(1, item.quantity + change) }
	// 				: item
	// 		)
	// 	);
	// };
	const updateQuantity = async (id, change) => {
		const currentItem = cartItems.find((item) => item.id === id);
		if (!currentItem) return;

		setCartItems((items) =>
			items.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + change) }
					: item
			)
		);

		try {
			await axios.put(`Cart_Item/${id}?amount=${change}`);
		} catch (error) {
			console.error("Error updating quantity in backend:", error);
		}
	};

	const removeItem = (id) => {
		setCartItems((items) => items.filter((item) => item.id !== id));
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

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h1 className="text-xl font-bold mb-6">Chi tiết giỏ hàng</h1>

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
													item.image ||
													"https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/329135/iphone-16-trang-2-638639086192667063-750x500.jpg"
												}
												alt={item.name}
												className="w-20 h-20 object-cover rounded-lg"
											/>
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
									<td className="py-4">
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													updateQuantity(item.id, -1)
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
													updateQuantity(item.id, 1)
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
											checked={item.isSelected || false}
											onChange={() =>
												toggleSelectItem(item.id)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="flex justify-between items-center mt-4">
						<span className="text-lg font-bold">Tổng tiền:</span>
						<span className="text-lg font-bold text-red-600">
							{formatPrice(totalSelectedPrice)}
						</span>
					</div>
				</div>

				<div className="flex justify-between mt-6">
					<button className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors">
						<ChevronLeft className="w-4 h-4" />
						Quay lại
					</button>
					<Link to="/cart/payment-info">
						<button className="px-6 py-2 bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] text-white rounded-lg hover:from-[#6DD5ED] hover:to-[#2193B0] transition-colors cursor-pointer">
							Mua hàng
						</button>
						{/* <button
							className={`px-6 py-2 ${
								selectedItems.length === 0
									? "bg-gray-400 cursor-not-allowed"
									: "bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] hover:from-[#6DD5ED] hover:to-[#2193B0]"
							} text-white rounded-lg transition-colors`}
							disabled={selectedItems.length === 0}
						>
							Mua hàng
						</button> */}
					</Link>
				</div>
			</div>
		</div>
	);
}

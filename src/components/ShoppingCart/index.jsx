import { useState } from "react";
import { Minus, Plus, X, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { formatPrice } from "../../utils/formatPrice";

export default function ShoppingCart() {
	const [cartItems, setCartItems] = useState([
		// {
		// 	id: 1,
		// 	image: "https://cdn.tgdd.vn/Products/Images/42/213031/TimerThumb/iphone-12-(76).jpg",
		// 	name: "iPhone 12 Mini",
		// 	model: "Màu Xanh Navy 64GB",
		// 	price: 30000000,
		// 	quantity: 1,
		// },
		// {
		// 	id: 2,
		// 	image: "https://cdn.tgdd.vn/Products/Images/42/213031/TimerThumb/iphone-12-(76).jpg",
		// 	name: "iPhone 11 Pro Max",
		// 	model: "Màu Xanh Navy 164GB",
		// 	price: 20000000,
		// 	quantity: 1,
		// },
	]);
	const cartId = localStorage.getItem("cartId");
	console.log(cartId);

	// 	useEffect(() => {
	// 		Promise.all([
	// 			axios.get(`/Cart_Item?cartId=${cartId}`),
	// 			axios.get("/Product_SKU/"),
	// 			axios.get("/Product_Image/"),
	// 		])
	// 			.then(([cartItemRes, skusRes, imagesRes]) => {
	// 				const cartItems = cartItemRes.data;
	// 				const skus = skusRes.data;
	// 				console.log(skus);
	// 				const images = imagesRes.data;
	// 				console.log(images);
	//
	// 				// Gộp dữ liệu dựa trên ProductId
	// 				const mergedCarts = cartItems.map((cartItem) => ({
	// 					...cartItem,
	// 					skus: skus.filter(
	// 						(sku) => sku.id === cartItem.product_SKUId
	// 					),
	// 					images: images.filter(
	// 						(img) => img.productId === product.productId
	// 					),
	// 				}));
	//
	// 				setCartItems(mergedProducts);
	// 			})
	// 			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	// 	}, [cartId]);

	const updateQuantity = (id, change) => {
		setCartItems((items) =>
			items.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + change) }
					: item
			)
		);
	};

	const removeItem = (id) => {
		setCartItems((items) => items.filter((item) => item.id !== id));
	};

	const total = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
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
								<th className="pb-4">Mã số</th>
								<th className="pb-4">Số lượng</th>
								<th className="pb-4 text-right">Giá</th>
								<th className="pb-4 text-right">Tổng</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{cartItems.map((item) => (
								<tr key={item.id} className="text-sm">
									<td className="py-4">
										<div className="flex items-center gap-4">
											<img
												src={
													"https://localhost:7011/uploads/" +
														item.image ||
													"/placeholder.svg"
												}
												alt={item.name}
												className="w-20 h-20 object-cover rounded-lg"
											/>
											<span className="font-medium">
												{item.name}
											</span>
										</div>
									</td>
									<td className="py-4">{item.model}</td>
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
									<td className="py-4 text-right">
										{formatPrice(item.price)}
									</td>
									<td className="py-4 text-right">
										{formatPrice(
											item.price * item.quantity
										)}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot className="border-t">
							<tr>
								<td
									colSpan={4}
									className="py-4 text-right font-bold"
								>
									Tổng tiền:
								</td>
								<td className="py-4 text-right font-bold text-red-600">
									{formatPrice(total)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div className="flex justify-between mt-6">
					<button className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors">
						<ChevronLeft className="w-4 h-4" />
						Tiếp tục mua hàng
					</button>
					<Link to="/cart/payment-info">
						<button className="px-6 py-2 bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] text-white rounded-lg hover:from-[#6DD5ED] hover:to-[#2193B0] transition-colors cursor-pointer">
							TIẾP THEO
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

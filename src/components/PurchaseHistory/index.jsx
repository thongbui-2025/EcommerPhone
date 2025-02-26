import axios from "axios";
import { Store, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link, useNavigate, useOutletContext } from "react-router";

const PurchaseHistory = () => {
	const [orderDetail, setOrderDetails] = useState(null);
	const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState(false); // Loading khi state  chưa update

	const userId = localStorage.getItem("userId");
	const navigate = useNavigate();

	const { handleSmooth } = useOutletContext();

	useEffect(() => {
		setIsLoadingOrderDetail(true);
		Promise.all([
			axios.get(`/Orders/getByUser/${userId}`),
			axios.get("/Order_Item"),
			axios.get("/Product_SKU"),
			axios.get("/Products"),
			axios.get("/Product_Image"),
		])
			.then(
				([orderRes, orderItemRes, skusRes, productsRes, imagesRes]) => {
					const orders = orderRes.data;
					// console.log("orders", orders);
					const orderItems = orderItemRes.data;
					// console.log("orderItems", orderItems);
					const skus = skusRes.data;
					// console.log("skus", skus);
					const products = productsRes.data;
					// console.log("products", products);
					const images = imagesRes.data;
					// console.log("images", images);

					// Chuyển đổi dữ liệu thành object map để tra cứu nhanh
					const skuMap = skus.reduce((acc, sku) => {
						acc[sku.id] = sku;
						return acc;
					}, {});
					// console.log("skuMap", skuMap);

					const productMap = products.reduce((acc, product) => {
						acc[product.id] = product;
						return acc;
					}, {});
					// console.log("productMap", productMap);

					const imageMap = images.reduce((acc, image) => {
						acc[image.productId] = image;
						return acc;
					}, {});
					// console.log("imageMap", imageMap);

					// Nhóm các orderItems theo orderId
					const ordersWithDetails = orders.map((order) => {
						const items = orderItems
							.filter((item) => item.orderId === order.id)
							.map((item) => {
								const sku = skuMap[item.product_SKUId] || {};
								// console.log(sku);
								const product =
									productMap[sku.productId || sku.id] || {};
								// console.log(product);
								const image = imageMap[product.id] || {};
								// console.log(image);

								return {
									...item,
									sku,
									product,
									image,
								};
							});

						return {
							...order,
							orderItems: items,
						};
					});
					setOrderDetails(ordersWithDetails);
				}
			)
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error))
			.finally(() => setIsLoadingOrderDetail(false)); //
	}, [userId]);

	console.log("orderDetail", orderDetail);

	const handleExploreClick = () => {
		navigate("/");
		setTimeout(() => {
			handleSmooth();
		}, 300);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Hot Promotions Section */}
			<div className="mb-12">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center">
						<div className="mr-2 h-6 w-1 bg-black"></div>
						<h2 className="text-2xl font-bold  mr-6">
							LỊCH SỬ ĐƠN HÀNG
						</h2>
					</div>
				</div>

				{isLoadingOrderDetail ? (
					<div className="text-center text-xl text-[#3ea8c0] font-semibold mt-10">
						Đang tải dữ liệu... ⏳
					</div>
				) : orderDetail?.length > 0 ? (
					<div className="max-w-7xl mx-auto space-y-4 mt-3">
						{orderDetail?.map((order) => (
							<div
								key={order.id}
								className="bg-white p-4 rounded-lg shadow"
							>
								{/* Store Header */}
								<div className="flex items-center justify-between border-b pb-4">
									<div className="flex items-center gap-3">
										<Store className="h-5 w-5" />
										<span className="font-medium">
											{order.storeName}
										</span>
										{/* <button className="bg-red-500 text-white px-3 py-1 rounded text-md">
								Chat
							</button> */}
										<button className="px-3 py-1 rounded text-md font-semibold">
											({order?.orderItems.length} sản
											phẩm/ 1 kiện)
										</button>
									</div>
									<div className="flex items-center gap-2 text-green-500">
										<span>
											{order.deliveryStatus ||
												"Giao hàng thành công"}
										</span>
										<HelpCircle className="h-4 w-4" />
										<span className="text-red-500 font-medium ml-2">
											{/* {order.status} */}
											HOÀN THÀNH
										</span>
									</div>
								</div>

								{/* Order Items */}
								<div className="py-4 space-y-4">
									{order.orderItems.map((item) => (
										<div
											key={item.id}
											className="flex gap-4"
										>
											<img
												src={
													`https://localhost:7011/uploads/${item?.product?.id}/` +
														item.image.imageName ||
													"/placeholder.svg"
												}
												alt={item.name}
												className="w-20 h-20 object-cover rounded"
											/>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<div>
														<h3 className="text-md">
															{item?.product.name}
														</h3>
														<p className="text-gray-500 text-md mt-1">
															Phân loại hàng:{" "}
															{item?.sku.color},{" "}
															{item?.sku.raM_ROM}
														</p>
														<p className="text-md mt-1">
															x{item?.quantity}
														</p>
													</div>
													<div className="text-right">
														{/* <p className="text-gray-400 line-through text-md">
												{formatPrice(item.price)}
											</p> */}
														<p className="text-red-500">
															{formatPrice(
																item.price *
																	item.quantity
															)}
														</p>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Total and Actions */}
								<div className="border-t pt-4">
									<div className="flex justify-end items-center gap-2 mb-4">
										<span className="text-gray-600">
											Thành tiền:
										</span>
										<span className="text-xl text-red-500 font-medium">
											{formatPrice(order?.orderTotal)}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<div className="text-md text-gray-500">
											Đánh giá sản phẩm trước{" "}
											{order.ratingDeadline}
										</div>
										<div className="flex gap-2">
											<button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
												Đánh Giá
											</button>
											<button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
												Mua Lại
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-xl text-[#3ea8c0] font-semibold mt-10">
						Bạn chưa có đơn hàng nào! 💖
						<br />
						<Link
							to="/"
							onClick={handleExploreClick}
							className="text-[#3ea8c0] underline hover:text-[#F92F60]"
						>
							Khám phá ngay
						</Link>{" "}
						và tìm sản phẩm để mua nhé!
					</div>
				)}
			</div>
		</div>
	);
};

export default PurchaseHistory;

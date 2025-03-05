import axios from "axios";
import { Store, HelpCircle, TruckIcon } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { Link, useNavigate, useOutletContext } from "react-router";
import Loading from "../Loading";
import { formatDate } from "../../utils/formatDate";

const PurchaseHistory = () => {
	const [orderDetail, setOrderDetails] = useState(null);
	const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [orderToDelete, setOrderToDelete] = useState(null);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewOrder, setReviewOrder] = useState({});
	const [reviews, setReviews] = useState({});

	const userId = localStorage.getItem("userId");
	const username = localStorage.getItem("username");

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
					const orderItems = orderItemRes.data;
					const skus = skusRes.data;
					const products = productsRes.data;
					const images = imagesRes.data;

					const skuMap = skus.reduce((acc, sku) => {
						acc[sku.id] = sku;
						return acc;
					}, {});

					const productMap = products.reduce((acc, product) => {
						acc[product.id] = product;
						return acc;
					}, {});

					const imageMap = images.reduce((acc, image) => {
						acc[image.productId] = image;
						return acc;
					}, {});

					// Nhóm các orderItems theo orderId
					const ordersWithDetails = orders.map((order) => {
						const items = orderItems
							.filter((item) => item.orderId === order.id)
							.map((item) => {
								const sku = skuMap[item.product_SKUId] || {};

								const product =
									productMap[sku.productId || sku.id] || {};
								const image = imageMap[product.id] || {};

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

	const handleConfirmModal = async () => {
		const apiUrl = `/Orders/cancel/${orderToDelete}`;
		if (apiUrl) {
			try {
				await axios.put(apiUrl);
				setOrderDetails((prevOrders) =>
					prevOrders.map((order) =>
						order?.id === orderToDelete
							? { ...order, status: 3 }
							: order
					)
				);
			} catch (error) {
				console.error("Error updating order status", error);
			} finally {
				setShowDeleteConfirmation(false);
				setOrderToDelete(null);
			}
		}
	};

	const handleCancelClick = (orderId) => {
		setOrderToDelete(orderId);
		setShowDeleteConfirmation(true);
	};

	const handleCancelModal = () => {
		setShowDeleteConfirmation(false);
		setOrderToDelete(null);
	};

	const handleReviewClick = (order) => {
		setReviewOrder(order);

		const defaultReviews = order.orderItems.reduce((acc, item) => {
			acc[item.id] = {
				rating: 5,
				productId: item.product.id,
				order_ItemId: item.id,
				userId: userId,
				username: username,
				orderId: order.id,
				classify: `${item.sku.color}, ${item.sku.raM_ROM}`,
				comment: "",
			};
			return acc;
		}, {});

		setReviews(defaultReviews);
		setShowReviewModal(true);
	};

	const handleSubmit = async () => {
		console.log(reviews);

		try {
			const reviewList = Object.values(reviews);
			const response = await axios.post("/Reviews", reviewList);

			if (response.status === 201) {
				alert("Đánh giá đã được gửi thành công!");
				setShowReviewModal(false);
				setReviews({});
			}
		} catch (error) {
			console.error("Lỗi khi gửi đánh giá:", error);
			alert("Gửi đánh giá thất bại, vui lòng thử lại!");
			setShowReviewModal(false);
			setReviews({});
		}
	};

	// const handleSubmit = async () => {
	// 	try {
	// 		await Promise.all(reviews.map((review) =>
	// 			axios.post("/api/Reviews", { ...review, userId: localStorage.getItem("userId") })
	// 		));
	// 		alert("Cảm ơn bạn đã đánh giá!");
	// 		onClose();
	// 	} catch (error) {
	// 		console.error("Lỗi khi gửi đánh giá:", error);
	// 	}
	// };

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
					<Loading />
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
										{/* Xử lý trạng thái đơn hàng */}
										<span
											className={`
												${order.status === 0 ? "text-orange-500" : ""}
												${order.status === 1 ? "text-blue-500" : ""}
												${order.status === 2 ? "text-green-500" : ""}
												${order.status === 3 ? "text-red-500" : ""}
												flex items-center gap-2
											`}
										>
											{(order.status === 1 ||
												order.status === 2) && (
												<TruckIcon className="h-5 w-5" />
											)}
											{order.status === 0 && "Chờ duyệt"}
											{order.status === 1 &&
												"Đang giao hàng"}
											{order.status === 2 &&
												"Giao hàng thành công"}
											{order.status != 3 && (
												<div className="relative group">
													<HelpCircle className="h-4 w-4 text-gray-500" />
													<div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md text-sm group-hover:block hidden">
														{formatDate(
															order?.orderDate
														)}
													</div>
												</div>
											)}
										</span>

										<span className="text-red-500 ml-2">
											{order.status === 0 && "CHỜ XỬ LÝ"}
											{order.status === 1 &&
												"CHỜ GIAO HÀNG"}
											{order.status === 2 && "HOÀN THÀNH"}
											{order.status === 3 && "ĐÃ HỦY"}
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
													<div className="text-right flex gap-2">
														<p className="text-black opacity-25 line-through text-md">
															{formatPrice(
																item?.sku
																	.defaultPrice *
																	item.quantity
															)}
														</p>
														<p className="text-red-500">
															{formatPrice(
																item?.sku
																	.finalPrice *
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
											{/* {order.ratingDeadline} */}
										</div>
										<div className="flex gap-2">
											{order?.status === 2 &&
												(!order?.isRate ? (
													<button
														className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
														onClick={() =>
															handleReviewClick(
																order
															)
														}
													>
														Đánh Giá
													</button>
												) : (
													<button
														className="px-4 py-2 bg-gray-500 text-white rounded"
														disabled
													>
														Đã Đánh Giá
													</button>
												))}
											{order?.status === 0 &&
												!order?.isPaid && ( // Nếu chưa thanh toán
													<button
														onClick={() =>
															handleCancelClick(
																order?.id
															)
														}
														className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
													>
														Yêu cầu hủy
													</button>
												)}
											<button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
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
			{/* Delete Confirmation Modal */}
			{showDeleteConfirmation && (
				<div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">
							Xác nhận hủy đơn hàng
						</h2>
						<p className="mb-4">
							Bạn có chắc chắn muốn hủy đơn hàng này{" "}
							{orderToDelete}?
						</p>
						<div className="flex justify-end space-x-2">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
								onClick={handleCancelModal}
							>
								Hủy
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
								onClick={handleConfirmModal}
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
			)}

			{showReviewModal && (
				<div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
						<h2 className="text-xl font-bold mb-4">
							Đánh giá sản phẩm
						</h2>
						{reviewOrder.orderItems.map((item) => (
							<div key={item.id} className="mb-4">
								<h3 className="mb-2 font-bold">
									{item.product.name}
								</h3>
								<div className="mb-2">
									Phân loại hàng: {item.sku.color},{" "}
									{item.sku.raM_ROM}
								</div>
								<div className="flex">
									{[1, 2, 3, 4, 5].map((star) => (
										<FaStar
											key={star}
											className={`cursor-pointer transition ${
												(reviews[item.id]?.rating ||
													0) >= star
													? "text-yellow-400"
													: "text-gray-300"
											}`}
											size={30}
											onClick={() =>
												setReviews((prev) => ({
													...prev,
													[item.id]: {
														...prev[item.id],
														rating: star,
														productId:
															item.product.id,
													},
												}))
											}
										/>
									))}
								</div>
								<textarea
									className="w-full p-2 border rounded mt-2"
									placeholder="Nhập đánh giá..."
									value={reviews[item.id]?.comment || ""}
									onChange={(e) =>
										setReviews((prev) => ({
											...prev,
											[item.id]: {
												...prev[item.id],
												comment: e.target.value,
											},
										}))
									}
								/>
							</div>
						))}
						<div className="flex justify-end space-x-2 mt-4">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
								onClick={() => setShowReviewModal(false)}
							>
								Hủy
							</button>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								onClick={handleSubmit}
							>
								Đánh Giá
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PurchaseHistory;

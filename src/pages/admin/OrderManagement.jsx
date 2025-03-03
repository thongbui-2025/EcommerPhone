import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import OrderDetails from "../../admin_components/OrderManagement/OrderDetails";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";

const ITEMS_PER_PAGE = 10;

const OrderManagement = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);

	useEffect(() => {
		Promise.all([
			axios.get("/Orders"),
			axios.get("/Order_Item"),
			axios.get("/Product_SKU"),
			axios.get("/Products"),
			axios.get("/Product_Image"),
		]).then(([orderRes, orderItemRes, skusRes, productsRes, imagesRes]) => {
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
					.filter((item) => item.orderId === order?.id)
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
			setOrders(ordersWithDetails);
		});
	}, []);

	console.log("orders", orders);

	// Logic pagination
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	// Lọc theo searchQuery
	const filteredOrders = orders.filter(
		(order) =>
			order?.receiverName ||
			("".toLowerCase().includes(searchQuery.toLowerCase()) &&
				(selectedStatus === null || order?.status === selectedStatus))
	);

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const displayedorders = filteredOrders.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const getStatusText = (status) => {
		switch (status) {
			case 0:
				return "Đang chờ duyệt";
			case 1:
				return "Đang giao hàng";
			case 2:
				return "Đã giao";
			case 3:
				return "Đã hủy";
			default:
				return status;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 0:
				return "text-yellow-600";
			case 1:
				return "text-blue-600";
			case 2:
				return "text-green-600";
			case 3:
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const handleApproveOrder = async (id) => {
		if (selectedOrder) {
			setSelectedOrder({
				...selectedOrder,
				status: 1,
			});
		}

		let apiUrl = `/Orders/ship/${id}`;
		if (apiUrl) {
			try {
				await axios.put(apiUrl);
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order?.id === id ? { ...order, status: 1 } : order
					)
				);
			} catch (error) {
				console.error("Error updating order status", error);
			}
		}
	};

	const handleCancelOrder = async (id) => {
		if (selectedOrder) {
			setSelectedOrder({
				...selectedOrder,
				status: 3,
			});
		}

		let apiUrl = `/Orders/cancel/${id}`;
		if (apiUrl) {
			try {
				await axios.put(apiUrl);
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order?.id === id ? { ...order, status: 3 } : order
					)
				);
			} catch (error) {
				console.error("Error updating order status", error);
			}
		}
	};

	const handleViewOrder = (orderId) => {
		const selectedOrder = orders.find((c) => c.id === orderId);
		if (selectedOrder) {
			setSelectedOrder(selectedOrder);
		}
	};

	const handleUpdateOrderStatus = async (orderId, newStatus) => {
		// Update the order status in both the order details and the list
		// if (selectedOrder) {
		// 	setSelectedOrder({
		// 		...selectedOrder,
		// 		status: newStatus,
		// 		history: [
		// 			{
		// 				status: newStatus,
		// 				date: new Date().toLocaleString("vi-VN"),
		// 				note: `Đơn hàng được chuyển sang trạng thái ${getStatusText(
		// 					newStatus
		// 				)}`,
		// 			},
		// 			...(selectedOrder.history || []),
		// 		],
		// 	});
		// }

		if (selectedOrder) {
			setSelectedOrder({
				...selectedOrder,
				status: newStatus,
			});
		}

		let apiUrl = "";
		if (newStatus === 1) {
			apiUrl = `/Orders/ship/${orderId}`;
		} else if (newStatus === 2) {
			apiUrl = `/Orders/deliver/${orderId}`;
		} else if (newStatus === 3) {
			apiUrl = `/Orders/cancel/${orderId}`;
		}

		if (apiUrl) {
			try {
				await axios.put(apiUrl);
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order.id === orderId
							? { ...order, status: newStatus }
							: order
					)
				);
			} catch (error) {
				console.error("Error updating order status", error);
			}
		}
	};

	if (selectedOrder) {
		return (
			<OrderDetails
				order={selectedOrder}
				onBack={() => setSelectedOrder(null)}
				onUpdateStatus={handleUpdateOrderStatus}
			/>
		);
	}

	return (
		<div className="flex-1 p-8">
			<div className="bg-white rounded-lg shadow">
				{/* Header */}
				<div className="border-b p-4">
					<h2 className="text-xl font-semibold">
						Danh sách đơn hàng
					</h2>
				</div>

				{/* Controls */}
				<div className="p-4 space-y-4">
					<div className="flex items-center space-x-4">
						<div className="flex-1 flex items-center">
							<input
								type="text"
								placeholder="Tìm kiếm theo tên khách hàng..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 p-2 border rounded mr-1"
							/>
							<button className="bg-blue-500 text-white p-3 rounded">
								<Search className="w-5 h-5" />
							</button>
						</div>

						<select
							value={selectedStatus}
							onChange={(e) =>
								setSelectedStatus(
									e.target.value === "null"
										? null
										: Number(e.target.value)
								)
							}
							className="p-2 border rounded"
						>
							<option value="null">Tất cả trạng thái</option>
							<option value="0">Đang chờ duyệt</option>
							<option value="1">Đang giao hàng</option>
							<option value="2">Đã giao</option>
							<option value="3">Đã hủy</option>
						</select>
					</div>

					{/* orders Table */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<th className="border p-3 text-left">
										STT
									</th>
									<th className="border p-3 text-left">
										Khách hàng
									</th>
									<th className="border p-3 text-left">
										Số điện thoại
									</th>
									<th className="border p-3 text-left">
										Ngày đặt
									</th>
									<th className="border p-3 text-left">
										Trạng thái
									</th>
									<th className="border p-3 text-left">
										Giá trị đơn hàng
									</th>
									<th className="border p-3 text-left">
										Xử lý đơn
									</th>
									<th className="border p-3 text-left">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody>
								{displayedorders
									.filter(
										(order) =>
											selectedStatus === null ||
											order.status === selectedStatus
									)
									.map((order, index) => (
										<tr
											key={order?.id}
											className="hover:bg-gray-50"
										>
											<td className="border p-3">
												{startIndex + index + 1}
											</td>
											<td className="border p-3">
												{order?.receiverName}
											</td>
											<td className="border p-3">
												{order?.receiverNumber}
											</td>
											<td className="border p-3">
												{formatDate(order?.orderDate)}
											</td>
											<td
												className={`border p-3 ${getStatusColor(
													order?.status
												)}`}
											>
												{getStatusText(order?.status)}
											</td>
											<td className="border p-3">
												{formatPrice(order?.orderTotal)}
											</td>
											<td className="border p-3">
												{order?.status === 0 && (
													<div className="flex space-x-2">
														<button
															onClick={() =>
																handleApproveOrder(
																	order?.id
																)
															}
															className="text-blue-500 hover:underline"
														>
															Duyệt đơn
														</button>
														<span>|</span>
														<button
															onClick={() =>
																handleCancelOrder(
																	order?.id
																)
															}
															className="text-red-500 hover:underline"
														>
															Hủy đơn
														</button>
													</div>
												)}
												{/* {order?.status === 1 && (
													<div className="flex space-x-2">
														<button
															onClick={() =>
																handleCancelOrder(
																	order?.id
																)
															}
															className="text-red-500 hover:underline"
														>
															Hủy đơn
														</button>
													</div>
												)} */}
											</td>
											<td className="border p-3">
												<button
													onClick={() =>
														handleViewOrder(
															order?.id
														)
													}
													className="text-blue-500 hover:underline flex items-center gap-1"
												>
													<Eye className="w-4 h-4" />
													Xem chi tiết
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-center space-x-2 mt-4">
						<button
							className="p-2 border rounded hover:bg-gray-100"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						{[...Array(totalPages)].map((_, index) => (
							<button
								key={index}
								className={`p-2 border rounded ${
									currentPage === index + 1
										? "bg-blue-500 text-white"
										: "hover:bg-gray-100"
								}`}
								onClick={() => handlePageChange(index + 1)}
							>
								{index + 1}
							</button>
						))}
						<button
							className="p-2 border rounded hover:bg-gray-100"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderManagement;

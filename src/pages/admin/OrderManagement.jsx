import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import OrderDetails from "../../admin_components/OrderManagement/OrderDetails";
import axios from "axios";

const OrderManagement = () => {
	useEffect(() => {
		axios
			.get("/Orders")
			.then((response) => console.log(response.data))
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	}, []);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [customers, setCustomers] = useState([
		{
			id: 1,
			name: "Tuong123",
			phone: "0903601020",
			orderDate: "31/12/2020",
			status: "pending",
			orderValue: 45000000,
		},
		{
			id: 2,
			name: "Huychuahe69",
			phone: "0903601020",
			orderDate: "31/12/2020",
			status: "delivering",
			orderValue: 30000000,
		},
		{
			id: 3,
			name: "Huychuahe69",
			phone: "0903601020",
			orderDate: "31/12/2020",
			status: "delivered",
			orderValue: 30000000,
		},
		{
			id: 4,
			name: "Huychuahe69",
			phone: "0903601020",
			orderDate: "31/12/2020",
			status: "cancelled",
			orderValue: 30000000,
		},
		{
			id: 5,
			name: "NguyenVanA",
			phone: "0901234567",
			orderDate: "01/01/2021",
			status: "delivered",
			orderValue: 25000000,
		},
	]);

	const [selectedOrder, setSelectedOrder] = useState(null);

	const mockOrderDetails = {
		id: 1,
		customerName: "Tuong123",
		customerPhone: "0903601020",
		customerAddress: "123 Đường ABC, Quận 1, TP.HCM",
		orderDate: "31/12/2020",
		status: "pending",
		totalValue: 45000000,
		products: [
			{
				id: 1,
				name: "iPhone 12",
				price: 30000000,
				quantity: 1,
				image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XZb0EdamED0thuP9ud1iYqkYJsG0k4.png",
			},
			{
				id: 2,
				name: "AirPods Pro",
				price: 15000000,
				quantity: 1,
				image: "/placeholder.svg",
			},
		],
		history: [
			{
				status: "pending",
				date: "31/12/2020 10:00",
				note: "Đơn hàng được tạo",
			},
		],
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price);
	};

	const getStatusText = (status) => {
		switch (status) {
			case "pending":
				return "Đang chờ duyệt";
			case "delivering":
				return "Đang giao hàng";
			case "delivered":
				return "Đã giao";
			case "cancelled":
				return "Đã hủy";
			default:
				return status;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "text-yellow-600";
			case "delivering":
				return "text-blue-600";
			case "delivered":
				return "text-green-600";
			case "cancelled":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const handleApproveOrder = (id) => {
		setCustomers((prevCustomers) =>
			prevCustomers.map((customer) =>
				customer.id === id
					? { ...customer, status: "delivering" }
					: customer
			)
		);
	};

	const handleCancelOrder = (id) => {
		setCustomers((prevCustomers) =>
			prevCustomers.map((customer) =>
				customer.id === id
					? { ...customer, status: "cancelled" }
					: customer
			)
		);
	};

	const handleViewOrder = (orderId) => {
		const selectedCustomer = customers.find((c) => c.id === orderId);
		if (selectedCustomer) {
			setSelectedOrder({
				...mockOrderDetails,
				id: selectedCustomer.id,
				customerName: selectedCustomer.name,
				customerPhone: selectedCustomer.phone,
				orderDate: selectedCustomer.orderDate,
				status: selectedCustomer.status,
				totalValue: selectedCustomer.orderValue,
			});
		}
	};

	const handleUpdateOrderStatus = (orderId, newStatus) => {
		// Update the order status in both the order details and the list
		if (selectedOrder) {
			setSelectedOrder({
				...selectedOrder,
				status: newStatus,
				history: [
					{
						status: newStatus,
						date: new Date().toLocaleString("vi-VN"),
						note: `Đơn hàng được chuyển sang trạng thái ${getStatusText(
							newStatus
						)}`,
					},
					...selectedOrder.history,
				],
			});
		}

		setCustomers((prevCustomers) =>
			prevCustomers.map((customer) =>
				customer.id === orderId
					? { ...customer, status: newStatus }
					: customer
			)
		);
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
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="p-2 border rounded"
						>
							<option value="all">Tất cả trạng thái</option>
							<option value="pending">Đang chờ duyệt</option>
							<option value="delivering">Đang giao hàng</option>
							<option value="delivered">Đã giao</option>
							<option value="cancelled">Đã hủy</option>
						</select>
					</div>

					{/* Customers Table */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<th className="border p-3 text-left">ID</th>
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
								{customers
									.filter(
										(customer) =>
											selectedStatus === "all" ||
											customer.status === selectedStatus
									)
									.map((customer) => (
										<tr
											key={customer.id}
											className="hover:bg-gray-50"
										>
											<td className="border p-3">
												{customer.id}
											</td>
											<td className="border p-3">
												{customer.name}
											</td>
											<td className="border p-3">
												{customer.phone}
											</td>
											<td className="border p-3">
												{customer.orderDate}
											</td>
											<td
												className={`border p-3 ${getStatusColor(
													customer.status
												)}`}
											>
												{getStatusText(customer.status)}
											</td>
											<td className="border p-3">
												{formatPrice(
													customer.orderValue
												)}
											</td>
											<td className="border p-3">
												{customer.status ===
													"pending" && (
													<div className="flex space-x-2">
														<button
															onClick={() =>
																handleApproveOrder(
																	customer.id
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
																	customer.id
																)
															}
															className="text-red-500 hover:underline"
														>
															Hủy đơn
														</button>
													</div>
												)}
												{customer.status ===
													"delivering" && (
													<div className="flex space-x-2">
														<button
															onClick={() =>
																handleCancelOrder(
																	customer.id
																)
															}
															className="text-red-500 hover:underline"
														>
															Hủy đơn
														</button>
													</div>
												)}
											</td>
											<td className="border p-3">
												<button
													onClick={() =>
														handleViewOrder(
															customer.id
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
						<button className="p-2 border rounded hover:bg-gray-100">
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button className="p-2 border rounded bg-blue-500 text-white">
							1
						</button>
						<button className="p-2 border rounded hover:bg-gray-100">
							2
						</button>
						<button className="p-2 border rounded hover:bg-gray-100">
							3
						</button>
						<button className="p-2 border rounded hover:bg-gray-100">
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderManagement;

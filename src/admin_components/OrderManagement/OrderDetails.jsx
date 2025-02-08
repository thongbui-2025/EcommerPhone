import {
	ArrowLeft,
	Package,
	Truck,
	CheckCircle,
	XCircle,
	Clock,
} from "lucide-react";

const OrderDetails = ({ order, onBack, onUpdateStatus }) => {
	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
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
				return "text-yellow-600 bg-yellow-50";
			case "delivering":
				return "text-blue-600 bg-blue-50";
			case "delivered":
				return "text-green-600 bg-green-50";
			case "cancelled":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return <Clock className="w-5 h-5" />;
			case "delivering":
				return <Truck className="w-5 h-5" />;
			case "delivered":
				return <CheckCircle className="w-5 h-5" />;
			case "cancelled":
				return <XCircle className="w-5 h-5" />;
			default:
				return <Package className="w-5 h-5" />;
		}
	};

	return (
		<div className="flex-1 p-8">
			<div className="bg-white rounded-lg shadow">
				{/* Breadcrumb */}
				<div className="bg-blue-400 text-white p-4 rounded-t-lg">
					Trang chủ / Đơn hàng / Chi tiết đơn hàng #{order.id}
				</div>

				<div className="p-6">
					{/* Back Button */}
					<button
						onClick={onBack}
						className="mb-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Quay lại
					</button>

					<div className="grid grid-cols-3 gap-6">
						{/* Order Information */}
						<div className="col-span-2 space-y-6">
							{/* Order Status */}
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div className="flex items-center gap-4">
									<div
										className={`p-2 rounded-full ${getStatusColor(
											order.status
										)}`}
									>
										{getStatusIcon(order.status)}
									</div>
									<div>
										<h3 className="font-semibold">
											Trạng thái đơn hàng
										</h3>
										<p
											className={getStatusColor(
												order.status
											)}
										>
											{getStatusText(order.status)}
										</p>
									</div>
								</div>
								{order.status === "pending" && (
									<div className="flex gap-2">
										<button
											onClick={() =>
												onUpdateStatus(
													order.id,
													"delivering"
												)
											}
											className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
										>
											Duyệt đơn
										</button>
										<button
											onClick={() =>
												onUpdateStatus(
													order.id,
													"cancelled"
												)
											}
											className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
										>
											Hủy đơn
										</button>
									</div>
								)}
								{order.status === "delivering" && (
									<div className="flex gap-2">
										<button
											onClick={() =>
												onUpdateStatus(
													order.id,
													"delivered"
												)
											}
											className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
										>
											Xác nhận đã giao
										</button>
										<button
											onClick={() =>
												onUpdateStatus(
													order.id,
													"cancelled"
												)
											}
											className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
										>
											Hủy đơn
										</button>
									</div>
								)}
								{order.status === "delivered" && (
									<div className="text-green-600 font-semibold">
										Đơn hàng đã được giao thành công
									</div>
								)}
							</div>

							{/* Products List */}
							<div className="border rounded-lg">
								<h3 className="font-semibold p-4 border-b">
									Sản phẩm
								</h3>
								<div className="p-4">
									<table className="w-full">
										<thead>
											<tr className="text-left">
												<th className="pb-4">
													Sản phẩm
												</th>
												<th className="pb-4">Giá</th>
												<th className="pb-4">
													Số lượng
												</th>
												<th className="pb-4 text-right">
													Thành tiền
												</th>
											</tr>
										</thead>
										<tbody className="divide-y">
											{order.products.map((product) => (
												<tr key={product.id}>
													<td className="py-4">
														<div className="flex items-center gap-4">
															<img
																src={
																	product.image ||
																	"/placeholder.svg"
																}
																alt={
																	product.name
																}
																className="w-16 h-16 object-cover rounded"
															/>
															<span>
																{product.name}
															</span>
														</div>
													</td>
													<td className="py-4">
														{formatPrice(
															product.price
														)}
													</td>
													<td className="py-4">
														{product.quantity}
													</td>
													<td className="py-4 text-right">
														{formatPrice(
															product.price *
																product.quantity
														)}
													</td>
												</tr>
											))}
										</tbody>
										<tfoot className="border-t">
											<tr>
												<td
													colSpan={3}
													className="py-4 text-right font-semibold"
												>
													Tổng tiền:
												</td>
												<td className="py-4 text-right font-semibold text-lg text-red-600">
													{formatPrice(
														order.totalValue
													)}
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>

						{/* Customer Information and Order History */}
						<div className="space-y-6">
							{/* Customer Information */}
							<div className="border rounded-lg">
								<h3 className="font-semibold p-4 border-b">
									Thông tin khách hàng
								</h3>
								<div className="p-4 space-y-4">
									<div>
										<label className="text-sm text-gray-600">
											Họ tên:
										</label>
										<p className="font-medium">
											{order.customerName}
										</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">
											Số điện thoại:
										</label>
										<p className="font-medium">
											{order.customerPhone}
										</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">
											Địa chỉ:
										</label>
										<p className="font-medium">
											{order.customerAddress}
										</p>
									</div>
								</div>
							</div>

							{/* Order History */}
							<div className="border rounded-lg">
								<h3 className="font-semibold p-4 border-b">
									Lịch sử đơn hàng
								</h3>
								<div className="p-4">
									<div className="space-y-4">
										{order.history.map((item, index) => (
											<div
												key={index}
												className="flex items-start gap-4 border-l-2 border-blue-500 pl-4 pb-4"
											>
												<div
													className={`p-2 rounded-full ${getStatusColor(
														item.status
													)}`}
												>
													{getStatusIcon(item.status)}
												</div>
												<div>
													<p className="font-medium">
														{getStatusText(
															item.status
														)}
													</p>
													<p className="text-sm text-gray-600">
														{item.date}
													</p>
													{item.note && (
														<p className="text-sm text-gray-600 mt-1">
															{item.note}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;

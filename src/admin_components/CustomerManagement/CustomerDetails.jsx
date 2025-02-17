import { ArrowLeft, Edit } from "lucide-react";

const CustomerDetails = ({ customer, onBack, onEdit }) => {
	return (
		<div className="flex-1 p-8">
			<div className="bg-white rounded-lg shadow">
				{/* Breadcrumb */}
				<div className="bg-blue-400 text-white p-4 rounded-t-lg">
					Trang chủ / Khách hàng / Chi tiết khách hàng
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

					<div className="space-y-6">
						{/* Customer Information */}
						<div className="border rounded-lg">
							<h3 className="font-semibold p-4 border-b">
								Thông tin khách hàng
							</h3>
							<div className="p-4 space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm text-gray-600">
											Họ và tên:
										</label>
										<p className="font-medium">
											{customer.userName}
										</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">
											Email:
										</label>
										<p className="font-medium">
											{customer.email}
										</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">
											Số điện thoại:
										</label>
										<p className="font-medium">
											{customer.phoneNumber}
										</p>
									</div>
									<div>
										<label className="text-sm text-gray-600">
											Địa chỉ:
										</label>
										<p className="font-medium">
											{customer.address}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex space-x-4">
							<button
								onClick={onEdit}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
								Sửa thông tin
							</button>
							{/* <button
								onClick={onDelete}
								className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
							>
								<Trash2 className="w-4 h-4" />
								Xóa khách hàng
							</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerDetails;

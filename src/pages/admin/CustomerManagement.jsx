import { useState } from "react";
import {
	Search,
	ChevronLeft,
	ChevronRight,
	Eye,
	Edit,
	Trash2,
} from "lucide-react";
import UpdateCustomer from "../../admin_components/CustomerManagement/UpdateCustomer";
import CustomerDetails from "../../admin_components/CustomerManagement/CustomerDetails";

const CustomerManagement = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [customers, setCustomers] = useState([
		{
			id: 1,
			name: "Tuong",
			email: "Tuong@mail.com",
			phone: "0903607077",
			address: "123 Đường ABC, Quận 1, TP.HCM",
		},
		{
			id: 2,
			name: "Huy",
			email: "Huy@mail.com",
			phone: "0903607077",
			address: "456 Đường XYZ, Quận 2, TP.HCM",
		},
	]);

	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [customerToDelete, setCustomerToDelete] = useState(null);

	const handleSearch = (e) => {
		e.preventDefault();
		// Filter implementation would go here
	};

	const handleViewCustomer = (customer) => {
		setSelectedCustomer(customer);
		setIsEditing(false);
	};

	const handleEditCustomer = (customer) => {
		setSelectedCustomer(customer);
		setIsEditing(true);
	};

	const handleUpdateCustomer = (updatedCustomer) => {
		setCustomers(
			customers.map((c) =>
				c.id === updatedCustomer.id ? updatedCustomer : c
			)
		);
		setSelectedCustomer(updatedCustomer);
		setIsEditing(false);
	};

	const handleDeleteClick = (customer) => {
		setCustomerToDelete(customer);
		setShowDeleteConfirm(true);
	};

	const handleConfirmDelete = () => {
		setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
		setShowDeleteConfirm(false);
		setCustomerToDelete(null);
		setSelectedCustomer(null);
	};

	if (isEditing && selectedCustomer) {
		return (
			<UpdateCustomer
				customer={selectedCustomer}
				onBack={() => setIsEditing(false)}
				onUpdate={handleUpdateCustomer}
			/>
		);
	}

	if (selectedCustomer) {
		return (
			<CustomerDetails
				customer={selectedCustomer}
				onBack={() => setSelectedCustomer(null)}
				onEdit={() => setIsEditing(true)}
				onDelete={() => handleDeleteClick(selectedCustomer)}
			/>
		);
	}

	return (
		<div className="flex-1 p-8">
			<div className="bg-white rounded-lg shadow">
				{/* Header */}
				<div className="border-b p-4">
					<h2 className="text-xl font-semibold">
						Danh sách khách hàng
					</h2>
				</div>

				{/* Search */}
				<div className="p-4">
					<form onSubmit={handleSearch} className="flex gap-2">
						<div className="flex-1 flex items-center">
							<input
								type="text"
								placeholder="Tìm kiếm..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 p-2 border rounded mr-1"
							/>
							<button
								type="submit"
								className="bg-blue-500 text-white p-3 rounded"
							>
								<Search className="w-5 h-5" />
							</button>
						</div>
					</form>
				</div>

				{/* Customers Table */}
				<div className="p-4">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-gray-50">
									<th className="border p-3 text-left">ID</th>
									<th className="border p-3 text-left">
										Họ và tên
									</th>
									<th className="border p-3 text-left">
										Email
									</th>
									<th className="border p-3 text-left">
										Số điện thoại
									</th>
									<th className="border p-3 text-left">
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody>
								{customers.map((customer) => (
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
											{customer.email}
										</td>
										<td className="border p-3">
											{customer.phone}
										</td>
										<td className="border p-3">
											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														handleViewCustomer(
															customer
														)
													}
													className="text-blue-500 hover:underline flex items-center gap-1"
												>
													<Eye className="w-4 h-4" />
													Xem
												</button>
												<button
													onClick={() =>
														handleEditCustomer(
															customer
														)
													}
													className="text-green-500 hover:underline flex items-center gap-1"
												>
													<Edit className="w-4 h-4" />
													Sửa
												</button>
												<button
													onClick={() =>
														handleDeleteClick(
															customer
														)
													}
													className="text-red-500 hover:underline flex items-center gap-1"
												>
													<Trash2 className="w-4 h-4" />
													Xóa
												</button>
											</div>
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

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">
							Xác nhận xóa khách hàng
						</h2>
						<p className="mb-4">
							Bạn có chắc chắn muốn xóa khách hàng{" "}
							{customerToDelete?.name}?
						</p>
						<div className="flex justify-end space-x-2">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
								onClick={() => setShowDeleteConfirm(false)}
							>
								Hủy
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
								onClick={handleConfirmDelete}
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomerManagement;

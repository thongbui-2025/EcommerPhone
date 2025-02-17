import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const UpdateCustomer = ({ customer, onBack, onUpdate }) => {
	const [formData, setFormData] = useState({
		id: customer.id,
		userName: customer.userName,
		email: customer.email,
		phoneNumber: customer.phoneNumber,
		address: customer.address,
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate(formData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="flex-1 p-8">
			<div className="bg-white rounded-lg shadow">
				{/* Breadcrumb */}
				<div className="bg-blue-400 text-white p-4 rounded-t-lg">
					Trang chủ / Khách hàng / Cập nhật thông tin
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

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="border rounded-lg">
							<h3 className="font-semibold p-4 border-b">
								Cập nhật thông tin khách hàng
							</h3>
							<div className="p-4 space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm text-gray-600 mb-1">
											Họ và tên
										</label>
										<input
											type="text"
											name="userName"
											value={formData.userName}
											onChange={handleChange}
											className="w-full p-2 border rounded"
											required
										/>
									</div>
									<div>
										<label className="block text-sm text-gray-600 mb-1">
											Email
										</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className="w-full p-2 border rounded"
											required
										/>
									</div>
									<div>
										<label className="block text-sm text-gray-600 mb-1">
											Số điện thoại
										</label>
										<input
											type="tel"
											name="phoneNumber"
											value={formData.phoneNumber}
											onChange={handleChange}
											className="w-full p-2 border rounded"
											required
										/>
									</div>
									<div>
										<label className="block text-sm text-gray-600 mb-1">
											Địa chỉ
										</label>
										<input
											type="text"
											name="address"
											value={formData.address}
											onChange={handleChange}
											className="w-full p-2 border rounded"
											required
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
							>
								Cập nhật
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateCustomer;

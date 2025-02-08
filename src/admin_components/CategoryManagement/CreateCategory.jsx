import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const CreateCategory = ({ onBack }) => {
	const [categoryData, setCategoryData] = useState({
		name: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCategoryData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Category Data:", categoryData);
		onBack();
	};

	return (
		<div className="bg-white rounded-lg shadow">
			{/* Breadcrumb */}
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Danh mục / Tạo danh mục
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

				<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
					{/* Category Name */}
					<div>
						<label className="block mb-1">Tên danh mục</label>
						<input
							type="text"
							name="name"
							value={categoryData.name}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
							placeholder="Nhập tên danh mục"
						/>
					</div>

					{/* Submit Button */}
					<div>
						<button
							type="submit"
							className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600"
						>
							Tạo danh mục
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateCategory;

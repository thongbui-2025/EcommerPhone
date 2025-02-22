import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const CreateCategory = ({ onBack, onCreate }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		onCreate({ name, description });
		onBack();
	};

	return (
		<div className="bg-white rounded-lg mt-5 p-5">
			{/* Breadcrumb */}
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Danh mục / Tạo danh mục
			</div>

			<div className="p-6 shadow">
				{/* Back Button */}
				<button
					onClick={onBack}
					className="mb-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
				>
					<ArrowLeft className="w-4 h-4" />
					Quay lại
				</button>

				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-2 space-y-6 space-x-15 max-w"
				>
					{/* Category Name */}
					<div>
						<label className="block mb-1">Tên danh mục</label>
						<input
							type="text"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Nhập tên danh mục"
							required
						/>
					</div>
					<div>
						<label className="block mb-1">Mô tả</label>
						<textarea
							name="shortDescription"
							value={description}
							className="w-full p-2 border rounded"
							onChange={(e) => setDescription(e.target.value)}
							rows="6"
							placeholder="Mô tả ngắn gọn về danh mục sản phẩm"
						></textarea>
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

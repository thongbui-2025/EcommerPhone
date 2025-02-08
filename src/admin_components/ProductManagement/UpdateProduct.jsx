import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";

const UpdateProduct = ({ product, onBack, onUpdate }) => {
	const [productData, setProductData] = useState({
		name: product.name,
		price: product.price,
		category: product.category || "",
		quantity: product.quantity,
		shortDescription: product.shortDescription || "",
		detailedDescription: product.description || "",
		productImages: [],
		avatarImage: null,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageUpload = (e, type) => {
		const files = Array.from(e.target.files);
		if (type === "avatar") {
			setProductData((prev) => ({
				...prev,
				avatarImage: files[0],
			}));
		} else {
			setProductData((prev) => ({
				...prev,
				productImages: files,
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Simulate API call to update product
		console.log("Updating product:", productData);
		// Call the onUpdate function passed from the parent component
		onUpdate({
			...product,
			...productData,
		});
		// Return to product list after update
		onBack();
	};

	return (
		<div className="bg-white rounded-lg shadow">
			{/* Breadcrumb */}
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / Cập nhật sản phẩm
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
					<div className="grid grid-cols-2 gap-6">
						{/* Left Column */}
						<div className="space-y-4">
							{/* Product Name */}
							<div>
								<label className="block mb-1">Tên</label>
								<input
									type="text"
									name="name"
									value={productData.name}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									placeholder="Tên sản phẩm"
								/>
							</div>

							{/* Price */}
							<div>
								<label className="block mb-1">Giá</label>
								<input
									type="number"
									name="price"
									value={productData.price}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									placeholder="Giá sản phẩm"
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block mb-1">Danh mục</label>
								<select
									name="category"
									value={productData.category}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								>
									<option value="">Chọn danh mục</option>
									<option value="phones">Điện thoại</option>
									<option value="tablets">
										Máy tính bảng
									</option>
								</select>
							</div>

							{/* Quantity */}
							<div>
								<label className="block mb-1">Số lượng</label>
								<input
									type="number"
									name="quantity"
									value={productData.quantity}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									placeholder="Số lượng"
								/>
							</div>
						</div>

						{/* Right Column */}
						<div className="space-y-4">
							{/* Short Description */}
							<div>
								<label className="block mb-1">
									Mô tả ngắn gọn
								</label>
								<textarea
									name="shortDescription"
									value={productData.shortDescription}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									rows="4"
									placeholder="Mô tả ngắn gọn về sản phẩm"
								/>
							</div>

							{/* Detailed Description */}
							<div>
								<label className="block mb-1">
									Mô tả chi tiết
								</label>
								<textarea
									name="detailedDescription"
									value={productData.detailedDescription}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									rows="4"
									placeholder="Mô tả chi tiết về sản phẩm"
								/>
							</div>

							{/* Image Uploads */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block mb-1">
										Hình ảnh sản phẩm
									</label>
									<div className="border-2 border-dashed rounded p-4 text-center">
										<input
											type="file"
											multiple
											onChange={(e) =>
												handleImageUpload(e, "product")
											}
											className="hidden"
											id="productImages"
										/>
										<label
											htmlFor="productImages"
											className="cursor-pointer flex flex-col items-center"
										>
											<Upload className="w-8 h-8 text-gray-400" />
											<span className="mt-2 text-sm text-gray-600">
												Tải ảnh lên
											</span>
										</label>
									</div>
								</div>

								<div>
									<label className="block mb-1">
										Hình ảnh đại diện
									</label>
									<div className="border-2 border-dashed rounded p-4 text-center">
										<input
											type="file"
											onChange={(e) =>
												handleImageUpload(e, "avatar")
											}
											className="hidden"
											id="avatarImage"
										/>
										<label
											htmlFor="avatarImage"
											className="cursor-pointer flex flex-col items-center"
										>
											<Upload className="w-8 h-8 text-gray-400" />
											<span className="mt-2 text-sm text-gray-600">
												Tải ảnh lên
											</span>
										</label>
									</div>
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
							Cập nhật sản phẩm
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateProduct;

"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const UpdateProduct_Sku = ({ product, onBack, onUpdate }) => {
	const [productData, setProductData] = useState({
		id: product?.id || 0,
		RAM_ROM: product?.raM_ROM || "",
		Color: product?.color || "",
		FinalPrice: product?.finalPrice || 0,
		images: product?.imageName || "",
		DefaultPrice: product?.defaultPrice || 0,
		Quantity: product?.quantity || 0,
		Sold: product?.sold || 0,
		isAvailable: product?.isAvailable || true,
		SKU: product?.sku || "",
	});

	const [productImage, setProductImage] = useState({
		imageName: product?.imageName || "",
		images: [],
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setProductImage({
				imageName: file.name,
				images: file,
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate(productData, productImage);
		onBack();
	};

	return (
		<div className="bg-white rounded-lg mt-5 p-5">
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / Cập nhật sản phẩm SKU
			</div>

			<div className="p-6 shadow">
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
							<div>
								<label className="block mb-1">id</label>
								<input
									type="text"
									name="SKU"
									value={productData.id}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>
							<div>
								<label className="block mb-1">SKU</label>
								<input
									type="text"
									name="SKU"
									value={productData.SKU}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">RAM/ROM</label>
								<input
									type="text"
									name="RAM_ROM"
									value={productData.RAM_ROM}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Màu sắc</label>
								<input
									type="text"
									name="Color"
									value={productData.Color}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Giá cuối</label>
								<input
									type="number"
									name="FinalPrice"
									value={productData.FinalPrice}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>
						</div>

						{/* Right Column */}
						<div className="space-y-4">
							<div>
								<label className="block mb-1">Giá gốc</label>
								<input
									type="number"
									name="DefaultPrice"
									value={productData.DefaultPrice}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Số lượng</label>
								<input
									type="number"
									name="Quantity"
									value={productData.Quantity}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Đã bán</label>
								<input
									type="number"
									name="Sold"
									value={productData.Sold}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									disabled
								/>
							</div>

							<div>
								<label className="block mb-1">
									Hình ảnh sản phẩm
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="w-full p-2 border rounded"
								/>
								{productImage.imageName && (
									<p className="mt-2 text-sm text-gray-600">
										File đã chọn: {productImage.imageName}
									</p>
								)}
							</div>
							<div>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										name="isAvailable"
										checked={productData.isAvailable}
										onChange={(e) =>
											setProductData((prev) => ({
												...prev,
												isAvailable: e.target.checked,
											}))
										}
										className="rounded"
									/>
									Còn hàng
								</label>
							</div>
						</div>
					</div>

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

export default UpdateProduct_Sku;

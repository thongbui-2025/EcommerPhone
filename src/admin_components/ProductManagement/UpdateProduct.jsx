"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const UpdateProduct = ({ product, onBack, onUpdate }) => {
	console.log(product);

	const [productData, setProductData] = useState({
		id: product?.id || 0,
		name: product?.name || "",
		description: product?.description || "",
		brandId: product?.brandId || "",
		chip: product?.chip || "",
		size: product?.size || "",
		lxWxHxW: product?.lxWxHxW || "",
		display: product?.display || "",
		frontCamera: product?.frontCamera || "",
		rearCamera: product?.rearCamera || "",
		battery: product?.battery || "",
		charger: product?.charger || "",
		accessories: product?.accessories || "",
		quality: product?.quality || "",
		sold: product?.sold || 0,
		isAvailable: product?.isAvailable ?? true,
		dayCreate: product?.dayCreate || new Date().toISOString(),
		dayUpdate: new Date().toISOString(),
	});

	const [productImage, setProductImage] = useState({
		id: product?.images?.id,
		productId: product?.id || 0,
		imageName: product?.images?.imageName || "",
		isMain: product?.images?.isMain,
		createdAt: product?.createdAt || new Date().toISOString(),
	});

	const [brands, setBrands] = useState([]);

	useEffect(() => {
		// Lấy danh sách Brands
		axios
			.get("/Brands")
			.then((response) => setBrands(response.data))
			.catch((error) => console.error("Error fetching brands:", error));
	}, []);

	// console.log(brands);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate({
			...productData,
			images: productImage,
		});
		onBack();
	};

	return (
		<div className="bg-white rounded-lg mt-5 p-5">
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / Cập nhật sản phẩm
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
								<label className="block mb-1">
									Tên sản phẩm
								</label>
								<input
									type="text"
									name="name"
									value={productData.name}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<label className="block mb-1">Thương hiệu</label>
							<select
								name="brandId"
								value={productData.brandId}
								onChange={handleInputChange}
								className="w-full p-2 border rounded"
							>
								{/* <option value="">Chọn thương hiệu</option> */}
								{brands.map((brand) => (
									<option key={brand.id} value={brand.id}>
										{brand.name}
									</option>
								))}
							</select>

							<div>
								<label className="block mb-1">Chip</label>
								<input
									type="text"
									name="chip"
									value={productData.chip}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Kích thước</label>
								<input
									type="text"
									name="size"
									value={productData.size}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">
									Kích thước chi tiết (DxRxCxN)
								</label>
								<input
									type="text"
									name="lxWxHxW"
									value={productData.lxWxHxW}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Màn hình</label>
								<input
									type="text"
									name="display"
									value={productData.display}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>
						</div>

						{/* Right Column */}
						<div className="space-y-4">
							<div>
								<label className="block mb-1">
									Camera trước
								</label>
								<input
									type="text"
									name="frontCamera"
									value={productData.frontCamera}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Camera sau</label>
								<input
									type="text"
									name="rearCamera"
									value={productData.rearCamera}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Pin</label>
								<input
									type="text"
									name="battery"
									value={productData.battery}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Sạc</label>
								<input
									type="text"
									name="charger"
									value={productData.charger}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Phụ kiện</label>
								<input
									type="text"
									name="accessories"
									value={productData.accessories}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>

							<div>
								<label className="block mb-1">Chất lượng</label>
								<input
									type="text"
									name="quality"
									value={productData.quality}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div>
							<label className="block mb-1">Mô tả</label>
							<textarea
								name="description"
								value={productData.description}
								onChange={handleInputChange}
								className="w-full p-2 border rounded"
								rows="4"
							/>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block mb-1">
									Hình ảnh sản phẩm
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											setProductImage((prev) => ({
												...prev,
												imageName: file.name,
												// file: file, // Add the actual file to the state
											}));
										}
									}}
									className="w-full p-2 border rounded"
								/>
								{productImage.imageName && (
									<p className="mt-2 text-sm text-gray-600">
										File đã chọn: {productImage.imageName}
									</p>
								)}
							</div>
							<div>
								<label className="block mb-1">Đã bán</label>
								<input
									type="number"
									name="sold"
									value={productData.sold}
									onChange={handleInputChange}
									className="w-full p-2 border rounded"
									disabled
								/>
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

export default UpdateProduct;

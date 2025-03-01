import { ArrowLeft, Edit } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { useEffect, useState } from "react";
import UpdateProduct_Sku from "./UpdateProduct_Sku";
import axios from "axios";

const ProductDetails = ({ product, onBack }) => {
	const [selectedMemory, setSelectedMemory] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedSku, setSelectedSku] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	// const [displayImage, setDisplayImage] = useState(null);

	// const image = product.images;
	// console.log("image", image);

	console.log("product", product);
	console.log("selectedSku", selectedSku);

	useEffect(() => {
		const skus = product?.skus;

		const availableSkus = skus.filter(
			(sku) => sku.quantity > 0 && sku.isAvailable
		);

		if (availableSkus.length > 0) {
			setSelectedMemory(availableSkus[0].raM_ROM);
			setSelectedColor(availableSkus[0].color);
			setSelectedSku(availableSkus[0]);
		}
	}, [product.skus, onBack]);

	useEffect(() => {
		console.log("Updated SKU State:", selectedSku);
	}, [selectedSku]);

	const specifications = [
		{ label: "Màn hình:", value: product?.display },
		{ label: "Camera sau:", value: product?.rearCamera },
		{ label: "Camera trước:", value: product?.frontCamera },
		{ label: "Chipset:", value: product?.chip },
		{ label: "Dung lượng pin:", value: product?.battery },
		{ label: "Kích thước màn hình:", value: product?.size },
		{ label: "Công nghệ sạc:", value: product?.charger },
		{ label: "Kích thước, khối lượng:", value: product?.lxWxHxW },
	];

	const memories = [...new Set(product?.skus.map((sku) => sku.raM_ROM))];
	const availableColors = selectedMemory
		? [
				...new Set(
					product?.skus
						.filter((sku) => sku.raM_ROM === selectedMemory)
						.map((sku) => sku.color)
				),
		  ]
		: [];

	const handleMemorySelection = (memory) => {
		setSelectedMemory(memory);
		setSelectedColor(null);
		const firstAvailableColor = product?.skus.find(
			(sku) => sku.raM_ROM === memory
		)?.color;
		if (firstAvailableColor) {
			setSelectedColor(firstAvailableColor);
			setSelectedSku(
				product?.skus.find(
					(sku) =>
						sku.raM_ROM === memory &&
						sku.color === firstAvailableColor
				)
			);
		}
	};

	const handleColorSelection = (color) => {
		if (availableColors.includes(color)) {
			setSelectedColor(color);
			setSelectedSku(
				product?.skus.find(
					(sku) =>
						sku.raM_ROM === selectedMemory && sku.color === color
				)
			);
		}
	};

	const handleEditSku = () => {
		setIsEditing(true);
	};

	const fetchUpdatedSku = async (skuId) => {
		try {
			const { data } = await axios.get(`/Product_SKU/${skuId}`);
			setSelectedSku(data);
		} catch (error) {
			console.error("Lỗi khi lấy lại SKU:", error);
		}
	};

	const handleUpdate = async (updatedProduct_Sku, updatedImage) => {
		try {
			const token = localStorage.getItem("token");
			console.log("Updated Product SKU:", updatedProduct_Sku);
			console.log("Updated Image:", updatedImage);

			const formData = new FormData();
			formData.append("id", updatedProduct_Sku?.id || 0);
			formData.append("RAM_ROM", updatedProduct_Sku?.RAM_ROM || "");
			formData.append("Color", updatedProduct_Sku?.Color || "");
			formData.append("FinalPrice", updatedProduct_Sku?.FinalPrice || 0);
			formData.append("images", updatedImage?.images);
			formData.append(
				"DefaultPrice",
				updatedProduct_Sku?.DefaultPrice || 0
			);
			formData.append("Quantity", updatedProduct_Sku?.Quantity || 0);
			formData.append("Sold", updatedProduct_Sku?.Sold || 0);
			formData.append(
				"isAvailable",
				updatedProduct_Sku?.isAvailable || true
			);
			formData.append("SKU", updatedProduct_Sku?.SKU || "");

			for (let pair of formData.entries()) {
				console.log(pair[0], pair[1]);
			}

			// Nếu có ảnh mới thì thêm vào formData
			if (updatedImage?.images && updatedImage?.images.length > 0) {
				// Có ảnh mới → thêm vào formData
				formData.append("images", updatedImage.images);
			} else if (updatedProduct_Sku?.imageName) {
				// Không có ảnh mới nhưng có ảnh cũ → tải về và thêm vào formData
				const response = await fetch(updatedProduct_Sku.imageName); // Tải ảnh từ URL
				const blob = await response.blob(); // Chuyển thành Blob
				const file = new File([blob], "old_image.jpg", {
					type: blob.type,
				}); // Tạo File từ Blob
				formData.append("images", file);
			} else {
				// Không có ảnh nào → Gửi rỗng hoặc bỏ qua
				console.log("Không có ảnh nào để gửi.");
			}

			// Gửi API cập nhật
			await axios.put(
				`/Product_SKU/${updatedProduct_Sku?.id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// Gọi API để lấy dữ liệu mới sau khi cập nhật
			await fetchUpdatedSku(updatedProduct_Sku?.id);
		} catch (error) {
			console.error("Lỗi khi cập nhật sản phẩm:", error);
		}
		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<UpdateProduct_Sku
				product={selectedSku}
				onBack={() => setIsEditing(false)}
				onUpdate={handleUpdate}
			/>
		);
	}

	return (
		<div className="bg-white rounded-lg p-8 mt-5">
			{/* Breadcrumb */}
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / {product.name}
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

				<div className="grid md:grid-cols-2 gap-8">
					{/* Product Image */}
					<div>
						<img
							src={
								`https://localhost:7011/uploads/${selectedSku?.productId}/` +
									selectedSku?.imageName || "/placeholder.svg"
							}
							alt={product.name}
							className="w-full h-auto object-cover rounded-lg"
						/>
					</div>

					{/* Product Details */}
					<div>
						<h1 className="text-3xl font-bold mb-4">
							{product.name}
						</h1>
						<h3 className="mb-2">Chọn bộ nhớ</h3>
						<div className="flex space-x-2 mb-4">
							{memories.map((memory) => (
								<div
									key={memory}
									className={`px-4 py-2 border-2 rounded-lg cursor-pointer ${
										selectedMemory === memory
											? "border-red-500 bg-red-100"
											: "border-gray-300"
									}`}
									onClick={() =>
										handleMemorySelection(memory)
									}
								>
									{memory}
								</div>
							))}
						</div>
						<h3 className="mb-2">Chọn màu</h3>
						<div className="flex space-x-2 mb-4">
							{availableColors.map((color) => (
								<div
									key={color}
									className={`px-4 py-2 border-2 rounded-lg cursor-pointer ${
										selectedColor === color
											? "border-red-500 bg-red-100"
											: "border-gray-300"
									}`}
									onClick={() => handleColorSelection(color)}
								>
									{color}
								</div>
							))}
						</div>
						<p className="text-2xl font-semibold mb-4">
							Số lượng: {selectedSku?.quantity}
						</p>

						{selectedSku && (
							<h3 className="text-2xl text-red-600 font-semibold mb-4">
								{selectedSku.quantity > 0 &&
								selectedSku.isAvailable
									? `${formatPrice(selectedSku.finalPrice)}`
									: "Hết hàng"}
							</h3>
						)}

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">
								Mô tả ngắn gọn:
							</h2>
							{/* <ul className="list-disc list-inside space-y-1"> */}
							{specifications.map((spec, index) => (
								<div
									key={index}
									className={`flex py-2 ${
										index !== specifications.length - 1
											? "border-b"
											: ""
									}`}
								>
									<span className="w-1/3 text-gray-600">
										{spec.label}
									</span>
									<span className="w-2/3 font-medium">
										{spec.value}
									</span>
								</div>
							))}
							{/* </ul> */}
						</div>

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">
								Mô tả chi tiết:
							</h2>
							<p>
								{product.description ||
									"Chưa có mô tả chi tiết cho sản phẩm này."}
							</p>
						</div>

						<div className="flex space-x-4">
							<button
								onClick={handleEditSku}
								className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
							>
								<Edit className="w-4 h-4" />
								Sửa
							</button>
							{/* <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2">
								<Trash2 className="w-4 h-4" />
								Xóa
							</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;

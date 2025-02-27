import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";

const CreateProduct_Sku = ({ onBack, onCreate }) => {
	const [skuData, setSkuData] = useState({
		productId: "",
		raM_ROM: "",
		sku: "",
		color: "",
		defaultPrice: "",
		discountPercentage: "",
		finalPrice: "",
		quantity: "",
		sold: "",
		default: true,
		isAvailable: true,
		createdAt: new Date().toISOString(),
		lastUpdatedAt: new Date().toISOString(),
		image: null,
	});
	// const [previewImages, setPreviewImages] = useState([]); // State để preview ảnh

	const handleSkuChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSkuData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleImageUpload = (e) => {
		// const files = Array.from(e.target.files);

		// Cập nhật skuData với files ảnh mới
		const file = e.target.files[0];
		setSkuData((prev) => ({
			...prev,
			image: file,
		}));

		// Tạo preview URLs cho ảnh
		// const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
		// setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
	};

	const removeImage = () => {
		// Xóa ảnh khỏi cả skuData và preview
		setSkuData((prev) => ({
			...prev,
			image: null,
		}));
		// Reset input file
		const fileInput = document.getElementById("productImage");
		if (fileInput) fileInput.value = "";

		// Xóa preview URL và giải phóng bộ nhớ
		// URL.revokeObjectURL(previewImages[index]);
		// setPreviewImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Tạo FormData để gửi cả dữ liệu và file
		const formData = new FormData();

		// Thêm các trường dữ liệu SKU vào FormData
		Object.keys(skuData).forEach((key) => {
			if (key !== "image") {
				formData.append(key, skuData[key]);
				console.log(skuData[key]);
			}
		});
		// Thêm file ảnh vào FormData nếu có
		if (skuData.image) {
			formData.append("images", skuData.image);
		}

		console.log("skuData", skuData);

		// Gọi hàm onCreate với FormData
		onCreate(formData);
	};

	return (
		<div className="bg-white rounded-lg mt-5 p-5">
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / Tạo sản phẩm
			</div>

			<div className="p-6 shadow">
				<button
					onClick={onBack}
					className="mb-6 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Về danh sách
				</button>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* SKU Data */}
					<h2 className="text-xl font-bold">Thông tin SKU</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{Object.keys(skuData).map((key) => {
							// Bỏ qua trường image trong form
							if (key === "image") return null;
							return (
								<div key={key}>
									<label className="block mb-1">{key}</label>
									{key === "default" ||
									key === "isAvailable" ? (
										<input
											type="checkbox"
											name={key}
											checked={skuData[key]}
											onChange={handleSkuChange}
											className="mr-2"
											required
										/>
									) : (
										<input
											type={
												[
													"defaultPrice",
													"discountPercentage",
													"finalPrice",
													"quantity",
													"sold",
												].includes(key)
													? "number"
													: "text"
											}
											name={key}
											value={skuData[key]}
											onChange={handleSkuChange}
											className="w-full p-2 border rounded"
											placeholder={`Nhập ${key}`}
											required
										/>
									)}
								</div>
							);
						})}
					</div>

					{/* Image Uploads */}
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Hình ảnh sản phẩm</h2>
						<div className="border-2 border-dashed rounded p-4">
							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								id="productImage"
							/>
							<label
								htmlFor="productImage"
								className="cursor-pointer flex flex-col items-center"
							>
								<Upload className="w-8 h-8 text-gray-400" />
								<span className="mt-2 text-sm text-gray-600">
									Tải ảnh lên
								</span>
							</label>

							{/* Image Preview */}
							{/* File Name Display */}
							{skuData.image && (
								<div className="mt-4">
									<div className="flex items-center justify-between bg-gray-50 p-2 rounded">
										<span className="text-sm truncate">
											{skuData.image.name}
										</span>
										<button
											type="button"
											onClick={removeImage}
											className="text-red-500 hover:text-red-700"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								</div>
							)}
						</div>
					</div>

					<button
						type="submit"
						className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded"
					>
						Tạo sản phẩm
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateProduct_Sku;

import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";

const CreateProductSku_Image = ({ onBack, onCreate }) => {
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
	});

	// const [imageData, setImageData] = useState({
	// 	productImage: null,
	// 	productImageURL: "",
	// });

	const [imageData, setImageData] = useState({
		productImages: [],
		avatarImage: null,
	});

	const handleSkuChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSkuData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// const handleImageUpload = (e) => {
	// 	const file = e.target.files[0]; // Chỉ lấy ảnh đầu tiên
	// 	if (file) {
	// 		const imageUrl = URL.createObjectURL(file);
	// 		setImageData({
	// 			productImage: imageUrl,
	// 			productImageURL: file.name,
	// 		});
	// 	}
	// };

	const handleImageUpload = (e, type) => {
		const files = Array.from(e.target.files);
		if (type === "product") {
			setImageData((prev) => ({
				...prev,
				productImages: files,
			}));
		} else {
			setImageData((prev) => ({ ...prev, avatarImage: files[0] }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onCreate({ skuData, imageData });
	};

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="bg-blue-500 text-white p-4 rounded-t-lg">
				Trang chủ / Tạo sản phẩm
			</div>

			<div className="p-6">
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
						{Object.keys(skuData).map((key) => (
							<div key={key}>
								<label className="block mb-1">{key}</label>
								{key === "default" || key === "isAvailable" ? (
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
						))}
					</div>

					{/* Image Uploads */}
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Hình ảnh sản phẩm</h2>
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
										required
									/>
									{imageData.productImage && (
										<div>
											<p>
												File name:{" "}
												{imageData.productImageURL}
											</p>
										</div>
									)}
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

							{/* <div>
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
							</div> */}
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

export default CreateProductSku_Image;

import { useEffect, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import axios from "axios";

const CreateProduct_Image = ({ onBack, onCreate }) => {
	const [productData, setProductData] = useState({
		name: "",
		description: "",
		brandId: "",
		chip: "",
		size: "",
		lxWxHxW: "",
		display: "",
		frontCamera: "",
		rearCamera: "",
		battery: "",
		charger: "",
		accessories: "",
		quality: "",
		sold: 0,
		isAvailable: true,
		dayCreate: new Date().toISOString(),
		dayUpdate: new Date().toISOString(),
	});

	const [imageData, setImageData] = useState({
		productImages: [],
		avatarImage: null,
	});

	const [brands, setBrands] = useState([]);

	useEffect(() => {
		// Lấy danh sách Brands
		axios
			.get("/Brands")
			.then((response) => setBrands(response.data))
			.catch((error) => console.error("Error fetching brands:", error));
	}, []);

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

	const handleProductChange = (e) => {
		const { name, value, type, checked } = e.target;
		setProductData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onCreate({ productData, imageData });
	};

	return (
		<div className="bg-white rounded-lg mt-5 p-5">
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / Tạo sản phẩm
			</div>

			<div className="p-6 shadow-sm">
				<button
					onClick={onBack}
					className="mb-6 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded flex items-center"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Về danh sách
				</button>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Product Data */}
					<h2 className="text-xl font-bold">Thông tin sản phẩm</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{Object.keys(productData).map((key) => (
							<div key={key}>
								<label className="block mb-1">{key}</label>
								{key === "description" ? (
									<textarea
										name={key}
										value={productData[key]}
										onChange={handleProductChange}
										className="w-full p-2 border rounded"
										rows="3"
										placeholder={`Nhập ${key}`}
										required
									/>
								) : key === "isAvailable" ? (
									<input
										type="checkbox"
										name={key}
										checked={productData[key]}
										onChange={handleProductChange}
										className="mr-2"
										required
									/>
								) : key === "brandId" ? (
									<select
										name="brandId"
										value={productData[key]}
										onChange={handleProductChange}
										className="w-full p-2 border rounded"
									>
										<option value="">
											Chọn thương hiệu
										</option>
										{brands.map((brand) => (
											<option
												key={brand.id}
												value={brand.id}
											>
												{brand.name}
											</option>
										))}
									</select>
								) : (
									<input
										type={
											key === "sold" ? "number" : "text"
										}
										name={key}
										value={productData[key]}
										onChange={handleProductChange}
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

export default CreateProduct_Image;

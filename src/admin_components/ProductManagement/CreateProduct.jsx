import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const CreateProduct = ({ onBack, onCreate }) => {
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

	const handleProductChange = (e) => {
		const { name, value, type, checked } = e.target;
		setProductData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onCreate({ productData });
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

export default CreateProduct;

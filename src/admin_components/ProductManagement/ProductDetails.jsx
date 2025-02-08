import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const ProductDetails = ({ product, onBack }) => {
	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	};

	return (
		<div className="bg-white rounded-lg shadow">
			{/* Breadcrumb */}
			<div className="bg-blue-400 text-white p-4 rounded-t-lg">
				Trang chủ / Sản phẩm / {product.name}
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

				<div className="grid md:grid-cols-2 gap-8">
					{/* Product Image */}
					<div>
						<img
							src={product.image || "/placeholder.svg"}
							alt={product.name}
							className="w-full h-auto object-cover rounded-lg"
						/>
					</div>

					{/* Product Details */}
					<div>
						<h1 className="text-3xl font-bold mb-4">
							{product.name}
						</h1>
						<p className="text-2xl text-red-600 font-semibold mb-4">
							{formatPrice(product.price)}
						</p>
						<p className="mb-4">Số lượng: {product.quantity}</p>

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">
								Mô tả ngắn gọn:
							</h2>
							<ul className="list-disc list-inside space-y-1">
								<li>Màn hình: 6.1, Super Retina</li>
								<li>CPU: A14</li>
								<li>Camera trước: 12.0 MP + 12.0 MP</li>
								<li>Camera sau: 12.0 MP</li>
								<li>RAM: 4 GB</li>
								<li>Bộ nhớ trong: 128 GB</li>
							</ul>
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
							<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
								<Edit className="w-4 h-4" />
								Sửa
							</button>
							<button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2">
								<Trash2 className="w-4 h-4" />
								Xóa
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;

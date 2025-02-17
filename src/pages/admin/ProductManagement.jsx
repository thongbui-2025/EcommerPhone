import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import UpdateProduct from "../../admin_components/ProductManagement/UpdateProduct";
import ProductDetails from "../../admin_components/ProductManagement/ProductDetails";
import CreateProduct from "../../admin_components/ProductManagement/CreateProduct";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const ProductManagement = () => {
	const [searchQuery, setSearchQuery] = useState("");
	// const [selectedCategory, setSelectedCategory] = useState("all");
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [productToUpdate, setProductToUpdate] = useState(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [productToDelete, setProductToDelete] = useState(null);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		Promise.all([
			axios.get("/Products"),
			axios.get("/Product_Image"),
			axios.get("/Product_SKU"),
		])
			.then(([productsRes, imagesRes, skusRes]) => {
				const products = productsRes.data;
				const images = imagesRes.data;
				const skus = skusRes.data;

				const imageMap = images.reduce((acc, image) => {
					acc[image.productId] = image;
					return acc;
				}, {});

				// Gộp dữ liệu dựa trên ProductId
				const mergedProducts = products.map((product) => ({
					...product,
					// images: images.filter(
					// 	(img) => img.ProductId === product.Id
					// ),
					images: imageMap[product.id] || {},
					skus: skus.filter((sku) => sku.ProductId === product.Id),
				}));

				setProducts(mergedProducts);
			})
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	}, []);

	console.log(products);

	// Logic pagination
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const displayedProducts = products.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price);
	};

	const handleProductUpdate = (updatedProduct) => {
		setProducts((prevProducts) =>
			prevProducts.map((product) =>
				product.id === updatedProduct.id
					? { ...product, ...updatedProduct }
					: product
			)
		);
		setProductToUpdate(null);
	};

	const handleDeleteClick = (product) => {
		setProductToDelete(product);
		setShowDeleteConfirmation(true);
	};

	const handleConfirmDelete = () => {
		setProducts((prevProducts) =>
			prevProducts.filter((p) => p.id !== productToDelete.id)
		);
		setShowDeleteConfirmation(false);
		setProductToDelete(null);
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirmation(false);
		setProductToDelete(null);
	};

	if (showCreateForm) {
		return <CreateProduct onBack={() => setShowCreateForm(false)} />;
	}

	if (selectedProduct) {
		return (
			<ProductDetails
				product={selectedProduct}
				onBack={() => setSelectedProduct(null)}
			/>
		);
	}

	if (productToUpdate) {
		return (
			<UpdateProduct
				product={productToUpdate}
				onBack={() => setProductToUpdate(null)}
				onUpdate={handleProductUpdate}
			/>
		);
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Main Content */}
			<div className="flex-1 p-8">
				<div className="bg-white rounded-lg shadow">
					{/* Breadcrumb */}
					<div className="bg-blue-400 text-white p-4 rounded-t-lg">
						Trang chủ / Sản phẩm
					</div>

					{/* Controls */}
					<div className="p-4 space-y-4">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => setShowCreateForm(true)}
								className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
							>
								Tạo mới
							</button>

							<div className="flex-1 flex items-center">
								<input
									type="text"
									placeholder="Tìm kiếm..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="flex-1 p-2 border rounded mr-1"
								/>
								<button className="bg-blue-500 text-white p-3 rounded">
									<Search className="w-5 h-5" />
								</button>
							</div>

							{/* <select
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(e.target.value)
								}
								className="p-2 border rounded"
							>
								<option value="all">Chọn danh mục</option>
								<option value="phones">Điện thoại</option>
								<option value="tablets">Máy tính bảng</option>
							</select>

							<button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
								Đặt lại
							</button> */}
						</div>

						{/* Products Table */}
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-50">
										<th className="border p-3 text-left">
											STT
										</th>
										<th className="border p-3 text-left">
											Hình ảnh
										</th>
										<th className="border p-3 text-left">
											Tên
										</th>
										<th className="border p-3 text-left">
											Giá
										</th>
										<th className="border p-3 text-left">
											Số lượng
										</th>
										<th className="border p-3 text-left">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{displayedProducts.map((product, index) => (
										<tr
											key={product.id}
											className="hover:bg-gray-50"
										>
											<td className="border p-3">
												{startIndex + index + 1}
											</td>
											<td className="border p-3">
												<img
													src={
														"https://localhost:7011/uploads/" +
															product.images
																.imageName ||
														"/placeholder.svg"
													}
													alt={product.name}
													className="w-16 h-16 object-cover rounded"
												/>
											</td>
											<td className="border p-3">
												{product.name}
											</td>
											<td className="border p-3">
												{formatPrice(
													product.skus[0]
														?.defaultPrice
												)}
											</td>
											<td className="border p-3">
												{product.quality}
											</td>
											<td className="border p-3">
												<div className="space-x-2">
													<button
														className="text-blue-500 hover:underline"
														onClick={() =>
															setSelectedProduct(
																product
															)
														}
													>
														Xem
													</button>
													<span>|</span>
													<button
														className="text-blue-500 hover:underline"
														onClick={() =>
															setProductToUpdate(
																product
															)
														}
													>
														Cập nhật
													</button>
													<span>|</span>
													<button
														className="text-red-500 hover:underline"
														onClick={() =>
															handleDeleteClick(
																product
															)
														}
													>
														Xóa
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-center space-x-2 mt-4">
							<button
								className="p-2 border rounded hover:bg-gray-100"
								onClick={() =>
									handlePageChange(currentPage - 1)
								}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="w-4 h-4" />
							</button>
							{[...Array(totalPages)].map((_, index) => (
								<button
									key={index}
									className={`p-2 border rounded ${
										currentPage === index + 1
											? "bg-blue-500 text-white"
											: "hover:bg-gray-100"
									}`}
									onClick={() => handlePageChange(index + 1)}
								>
									{index + 1}
								</button>
							))}
							<button
								className="p-2 border rounded hover:bg-gray-100"
								onClick={() =>
									handlePageChange(currentPage + 1)
								}
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirmation && (
				<div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">
							Xác nhận xóa sản phẩm
						</h2>
						<p className="mb-4">
							Bạn có chắc chắn muốn xóa sản phẩm
							{productToDelete?.name}?
						</p>
						<div className="flex justify-end space-x-2">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
								onClick={handleCancelDelete}
							>
								Hủy
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
								onClick={handleConfirmDelete}
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductManagement;

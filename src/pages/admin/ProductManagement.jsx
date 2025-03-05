import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import UpdateProduct from "../../admin_components/ProductManagement/UpdateProduct";
import ProductDetails from "../../admin_components/ProductManagement/ProductDetails";
import { formatPrice } from "../../utils/formatPrice";
import CreateProduct_Image from "../../admin_components/ProductManagement/CreateProduct_Image";
import CreateProduct_Sku from "../../admin_components/ProductManagement/CreateProduct_Sku";

const ITEMS_PER_PAGE = 10;

const ProductManagement = () => {
	const [searchQuery, setSearchQuery] = useState("");
	// const [selectedCategory, setSelectedCategory] = useState("all");
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showCreateSkuImageForm, setShowCreateSkuImageForm] = useState(false);
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

				const skuMap = skus.reduce((acc, sku) => {
					if (!acc[sku.productId]) {
						acc[sku.productId] = []; // Nếu chưa có key này, tạo một mảng rỗng
					}
					acc[sku.productId].push(sku); // Thêm đối tượng SKU vào mảng
					return acc;
				}, {});

				// Gộp dữ liệu dựa trên ProductId
				const mergedProducts = products?.map((product) => ({
					...product,
					images: imageMap[product.id] || {},
					skus: skuMap[product.id] || {},
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

	// Lọc theo searchQuery
	const filteredCustomer = products.filter((product) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const displayedProducts = filteredCustomer.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const handleCreateProduct_Image = async ({ productData, imageData }) => {
		console.log("Product Data:", productData);
		console.log("Image Data:", imageData);

		const token = localStorage.getItem("token");
		if (!token) {
			alert("Bạn chưa đăng nhập!");
			return;
		}

		let newProduct;

		try {
			const responseProduct = await axios.post("/Products", productData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("responseProduct", responseProduct);

			newProduct = responseProduct.data; // Gán giá trị cho biến toàn cục
			setProducts((prevProducts) => [...prevProducts, newProduct]);
			// setShowCreateForm(false);
		} catch (error) {
			console.error(error);
		}

		// Upload hình ảnh
		const formData = new FormData();
		formData.append("images", imageData.productImages[0]); // Kiểm tra key ảnh đúng chưa

		// Kiểm tra dữ liệu trước khi gửi
		for (let pair of formData.entries()) {
			console.log(pair[0], pair[1]);
		}

		console.log("newProduct", newProduct);

		const productId = newProduct.id;
		console.log("productId", productId);

		try {
			const responseProduct_Image = await axios.post(
				`/Product_Image?productId=${productId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			console.log("Images:", responseProduct_Image.data);
			// Tạo object ảnh đầy đủ dựa trên response và productId đã biết
			const newImage = {
				id: Date.now(), // Hoặc lấy từ response nếu có
				productId: productId,
				product: null,
				imageName: responseProduct_Image.data[0],
				isMain: false,
				createdAt: new Date().toISOString(),
			};

			// Cập nhật ảnh vào sản phẩm
			setProducts((prevProducts) =>
				prevProducts?.map((product) =>
					product.id === newImage.productId
						? {
								...product,
								images: newImage,
						  }
						: product
				)
			);
			setShowCreateForm(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreateProductSku = (skuData) => {
		console.log("SKU Data:", skuData);
		// Xử lý post theo FormData cho skuData
		const token = localStorage.getItem("token");
		if (!token) {
			alert("Bạn chưa đăng nhập!");
			return;
		}
		// Tạo SKU cho sản phẩm
		axios
			.post(`/Product_SKU`, skuData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log("Sku", response.data);

				const Sku = response.data;

				// Merge dữ liệu sản phẩm
				const mergedProducts = products?.map((product) => {
					if (product.id === Sku.productId) {
						return {
							...product,
							skus: Array.isArray(product.skus) // Nếu chưa có skus nào thì tạo mảng mới vì ban đầu là {}
								? [...(product.skus || []), Sku] // Thêm SKU vào mảng hiện tại
								: [Sku],
						};
					}
					return product;
				});
				setProducts(mergedProducts);
				setShowCreateSkuImageForm(false);
			})
			.catch((error) =>
				console.error("Lỗi khi tạo sản phẩm mới:", error)
			);
	};

	const handleProductUpdate = async (updatedProduct, imageData) => {
		try {
			const token = localStorage.getItem("token");
			console.log("updatedProduct", updatedProduct);
			console.log("productImage", imageData);

			// Update the product
			await axios.put(`/Products/${updatedProduct.id}`, updatedProduct, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			setProducts((prevProducts) =>
				prevProducts?.map((product) =>
					product.id === updatedProduct.id
						? { ...product, ...updatedProduct }
						: product
				)
			);

			// ⭐ Kiểm tra nếu không có ảnh mới thì dừng tại đây
			if (
				!imageData?.images ||
				(Array.isArray(imageData?.images) &&
					imageData?.images.length === 0)
			) {
				console.log("Không có ảnh mới, bỏ qua cập nhật ảnh!");
				return;
			}

			// Update Image
			const formData = new FormData();
			formData.append("id", imageData?.id || "");
			formData.append("images", imageData?.images); // Kiểm tra key ảnh đúng chưa

			for (let pair of formData.entries()) {
				console.log(pair[0], pair[1]);
			}

			await axios.put(`/Product_Image/${imageData.id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			// Lấy ảnh mới sau khi cập nhật
			const response = await axios.get(`/Product_Image/${imageData.id}`);
			console.log("newImage", response.data);
			const newImage = response.data;

			// Cập nhật state với ảnh mới
			setProducts((prevProducts) =>
				prevProducts.map((product) =>
					product.id === updatedProduct.id
						? { ...product, images: newImage }
						: product
				)
			);
		} catch (error) {
			console.error("Lỗi khi cập nhật sản phẩm:", error);
		}
	};

	// const handleDeleteClick = (product) => {
	// 	setProductToDelete(product);
	// 	setShowDeleteConfirmation(true);
	// };

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
		return (
			<CreateProduct_Image
				onBack={() => setShowCreateForm(false)}
				onCreate={handleCreateProduct_Image}
			/>
		);
	}

	if (showCreateSkuImageForm) {
		return (
			<CreateProduct_Sku
				onBack={() => setShowCreateSkuImageForm(false)}
				onCreate={handleCreateProductSku}
			/>
		);
	}

	if (selectedProduct) {
		if (Object.keys(selectedProduct.skus).length !== 0) {
			// Kiểm trac có tạo sku cho sản phẩm chưa
			return (
				<ProductDetails
					product={selectedProduct}
					onBack={() => setSelectedProduct(null)}
				/>
			);
		}
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
								Tạo sản phẩm và Image
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
							</div>
							<button
								onClick={() => setShowCreateSkuImageForm(true)}
								className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
							>
								Tạo Sku cho sản phẩm
							</button>
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
									{displayedProducts?.map(
										(product, index) => (
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
															`https://localhost:7011/uploads/${product.id}/` +
																product?.images
																	?.imageName ||
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
														product?.skus?.[0]
															?.defaultPrice ?? 0
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
														{/* <span>|</span>
														<button
															className="text-red-500 hover:underline"
															onClick={() =>
																handleDeleteClick(
																	product
																)
															}
														>
															Xóa
														</button> */}
													</div>
												</td>
											</tr>
										)
									)}
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
							{[...Array(totalPages)]?.map((_, index) => (
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

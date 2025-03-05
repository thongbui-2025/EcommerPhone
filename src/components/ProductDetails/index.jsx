import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

export default function ProductDetails() {
	// const [isExpanded, setIsExpanded] = useState(false);
	const { id } = useParams();
	const cartId = localStorage.getItem("cartId");
	const userId = localStorage.getItem("userId");
	console.log("productId:", id);

	const [product, setProduct] = useState({
		images: [],
		skus: [],
		reviews: [],
	});
	const [selectedMemory, setSelectedMemory] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedSku, setSelectedSku] = useState(null);
	const navigate = useNavigate();

	// Modal state
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [modalType, setModalType] = useState("success"); // success or error
	const token = localStorage.getItem("token");

	const [currentPage, setCurrentPage] = useState(1);
	const reviewsPerPage = 5;

	useEffect(() => {
		Promise.all([
			axios.get("/Products/" + id),
			axios.get("/Product_Image/getByProduct/" + id),
			axios.get("/Product_SKU/getByProduct/" + id),
			axios.get("/Reviews/getByProduct/" + id),
		])
			.then(([productsRes, imagesRes, skusRes, reviewsRes]) => {
				const products = productsRes.data;
				const images = imagesRes.data;
				const skus = skusRes.data;
				const reviews = reviewsRes.data;

				const availableSkus = skus.filter(
					(sku) => sku.quantity > 0 && sku.isAvailable
				);

				setProduct({ ...products, images, skus, reviews });

				if (availableSkus.length > 0) {
					setSelectedMemory(availableSkus[0].raM_ROM);
					setSelectedColor(availableSkus[0].color);
					setSelectedSku(availableSkus[0]);
				}
			})
			.catch((error) => console.error("Error fetching data:", error));
	}, [id]);

	// Lấy đánh giá thuộc trang hiện tại
	const indexOfLastReview = currentPage * reviewsPerPage;
	const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
	const currentReviews = product.reviews.slice(
		indexOfFirstReview,
		indexOfLastReview
	);

	console.log(product);

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

	const memories = [...new Set(product.skus.map((sku) => sku.raM_ROM))];

	console.log("memories", memories);

	const availableColors = selectedMemory
		? [
				...new Set(
					product.skus
						.filter((sku) => sku.raM_ROM === selectedMemory)
						.map((sku) => sku.color)
				),
		  ]
		: [];

	const handleMemorySelection = (memory) => {
		setSelectedMemory(memory);
		setSelectedColor(null);
		const firstAvailableColor = product.skus.find(
			(sku) => sku.raM_ROM === memory
		)?.color;
		if (firstAvailableColor) {
			setSelectedColor(firstAvailableColor);
			setSelectedSku(
				product.skus.find(
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
				product.skus.find(
					(sku) =>
						sku.raM_ROM === selectedMemory && sku.color === color
				)
			);
		}
	};

	const [loading, setLoading] = useState(false);

	const handleAddToCart = async () => {
		if (userId === null) {
			toast.success("Vui lòng đăng nhập để mua hàng!", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				onClose: () => {
					navigate("/login");
				},
			});
			return;
		}

		if (!selectedSku) {
			toast.info(
				"Vui lòng chọn bộ nhớ và màu sắc trước khi thêm vào giỏ.",
				{
					position: "top-center",
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					// onClose: () => {
					// 	navigate("/login");
					// },
				}
			);
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post("/Product_SKU/addToCart", null, {
				params: {
					cartId: cartId,
					product_SKUId: selectedSku.id,
				},

				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Added to cart:", response.data);
			// Show success modal instead of alert
			setModalType("success");
			setModalMessage("Thêm vào giỏ hàng thành công!");
			setShowModal(true);

			// Gửi sự kiện cập nhật giỏ hàng
			window.dispatchEvent(new Event("cartUpdated"));
		} catch (error) {
			console.error("Error adding to cart:", error);

			// Show error modal instead of alert
			setModalType("error");
			setModalMessage("Có lỗi xảy ra khi thêm vào giỏ.");
			setShowModal(true);
		} finally {
			setLoading(false);
		}
	};

	const handleBuyNow = () => {
		navigate("/cart/payment-info", {
			state: { buyNowProduct: selectedSku, quantity: 1 },
		});
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<ToastContainer />

			{/* Modal Component */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div
						className="absolute inset-0 bg-black opacity-50"
						onClick={() => setShowModal(false)}
					></div>
					<div className="bg-white rounded-lg p-6 shadow-xl z-10 max-w-md w-full">
						<div
							className={`text-center ${
								modalType === "success"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
								{modalType === "success" ? (
									<svg
										className="h-6 w-6 text-green-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								) : (
									<svg
										className="h-6 w-6 text-red-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								)}
							</div>
							<h3 className="text-lg font-medium mb-2">
								{modalType === "success" ? "Thành công" : "Lỗi"}
							</h3>
							<p className="text-sm text-gray-500">
								{modalMessage}
							</p>
							{modalType === "success" ? (
								<div className="flex justify-center gap-4 mt-4">
									<button
										className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
										onClick={() => setShowModal(false)}
									>
										Tiếp tục mua hàng
									</button>
									<button
										className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
										onClick={() => {
											setShowModal(false);
											navigate("/cart");
										}}
									>
										Đến giỏ hàng
									</button>
								</div>
							) : (
								<button
									className="mt-4 px-4 py-2 rounded-md bg-red-600 text-white"
									onClick={() => setShowModal(false)}
								>
									Đóng
								</button>
							)}
						</div>
					</div>
				</div>
			)}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="grid md:grid-cols-2 gap-8">
					{/* Left Column - Product Image */}
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">{product.name}</h1>
						<div className="aspect-square relative">
							<img
								src={
									selectedSku?.imageName
										? `https://localhost:7011/uploads/${selectedSku?.productId}/` +
										  selectedSku?.imageName
										: "/productNoImage.svg"
								}
								alt="iPhone 12"
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="text-center">
							<span className="text-3xl font-bold text-red-600">
								{/* 30.990.000 đ */}
								{selectedSku && (
									<h3 className="">
										{selectedSku.quantity > 0 &&
										selectedSku.isAvailable
											? `${selectedSku.finalPrice.toLocaleString()} đ`
											: "Hết hàng"}
									</h3>
								)}
							</span>
						</div>
						<p className="text-gray-700 text-sm">
							{product.description}
						</p>

						{/* <div className="flex gap-4">
							<Link to="/cart">
								<button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 cursor-pointer transition-colors">
									MUA NGAY
								</button>
							</Link>
							<Link to="/">
								<button className="bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer hover:from-[#6DD5ED] hover:to-[#2193B0]">
									<ChevronLeft className="w-5 h-5" />
									Quay lại
								</button>
							</Link>
						</div> */}
					</div>

					{/* Right Column - Specifications */}
					<div>
						<div className="p-4 font-sans">
							<h3 className="mb-2">Chọn bộ nhớ</h3>
							{memories.length > 0 ? (
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
							) : (
								<p className="ml-3 font-semibold mb-2">
									Không có bộ nhớ nào
								</p>
							)}

							<h3 className="mb-2">Chọn màu</h3>
							{availableColors.length > 0 ? (
								<div className="flex space-x-2 mb-4">
									{availableColors.map((color) => (
										<div
											key={color}
											className={`px-4 py-2 border-2 rounded-lg cursor-pointer ${
												selectedColor === color
													? "border-red-500 bg-red-100"
													: "border-gray-300"
											}`}
											onClick={() =>
												handleColorSelection(color)
											}
										>
											{color}
										</div>
									))}
								</div>
							) : (
								<p className="ml-3 font-semibold mb-2">
									Không có màu nào
								</p>
							)}

							{selectedSku && (
								<h3 className="mt-4 text-lg font-semibold">
									{selectedSku.quantity > 0 &&
									selectedSku.isAvailable
										? `Giá: ${selectedSku.finalPrice.toLocaleString()} đ`
										: "Hết hàng"}
								</h3>
							)}
						</div>
						<div className="p-4 flex gap-4">
							<button
								className="bg-white text-[#2193B0] border border-[#2193B0] px-4 py-2 rounded-lg hover:bg-[#E0F7FB] disabled:opacity-50"
								onClick={handleAddToCart}
								disabled={loading}
							>
								{loading ? "Đang thêm..." : "Thêm vào giỏ"}
							</button>
							{selectedSku && userId && (
								<button
									onClick={handleBuyNow}
									className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
								>
									Mua ngay
								</button>
							)}
						</div>

						<div className="border rounded-lg p-4 mb-6">
							<h2 className="text-lg font-bold mb-4">
								Thông số kỹ thuật
							</h2>
							<div className="space-y-2">
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
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white rounded-lg shadow-sm p-6 my-6">
				<h3 className="text-lg font-bold mb-4">Đánh giá sản phẩm</h3>
				{currentReviews.length > 0 ? (
					<div className="space-y-4">
						{currentReviews.map((review, index) => (
							<div key={review.id} className="pb-4">
								<p className="font-semibold">
									{review.username}
								</p>
								<p className="text-yellow-500">
									{"⭐".repeat(review.rating)}
								</p>

								<span className="text-gray-500 text-sm">
									{new Date(review.createdAt).toLocaleString(
										"vi-VN"
									) +
										" | Phân loại hàng: " +
										review.classify}
								</span>
								<p className="text-gray-700">
									{review.comment}
								</p>
								{index !== currentReviews.length - 1 && (
									<hr className="mt-4 border-gray-300" />
								)}
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">Chưa có đánh giá nào.</p>
				)}

				{/* Pagination Controls */}
				{product.reviews.length > reviewsPerPage && (
					<div className="flex justify-center space-x-4 mt-4">
						<button
							className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Trước
						</button>
						<span className="px-4 py-2 font-semibold">
							{currentPage} /{" "}
							{Math.ceil(product.reviews.length / reviewsPerPage)}
						</span>
						<button
							className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={
								indexOfLastReview >= product.reviews.length
							}
						>
							Tiếp
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

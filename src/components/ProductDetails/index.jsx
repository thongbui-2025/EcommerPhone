import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
	// const [isExpanded, setIsExpanded] = useState(false);
	const { id } = useParams();
	const cartId = localStorage.getItem("cartId");
	console.log("productId:", id);

	const [product, setProduct] = useState({
		images: [],
		skus: [],
	});
	const [selectedMemory, setSelectedMemory] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedSku, setSelectedSku] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		Promise.all([
			axios.get("/Products/" + id),
			axios.get("/Product_Image/getByProduct/" + id),
			axios.get("/Product_SKU/getByProduct/" + id),
		])
			.then(([productsRes, imagesRes, skusRes]) => {
				const products = productsRes.data;
				const images = imagesRes.data;
				const skus = skusRes.data;
				const availableSkus = skus.filter(
					(sku) => sku.quantity > 0 && sku.isAvailable
				);

				const mergedProduct = {
					...products,
					images: images,
					skus: skus,
				};

				setProduct(mergedProduct);

				if (availableSkus.length > 0) {
					setSelectedMemory(availableSkus[0].raM_ROM);
					setSelectedColor(availableSkus[0].color);
					setSelectedSku(availableSkus[0]);
				}
			})
			.catch((error) => console.error("Error fetching data:", error));
	}, [id]);

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
		setLoading(true);
		try {
			const response = await axios.post("/Product_SKU/addToCart", null, {
				params: {
					cartId: cartId,
					product_SKUId: selectedSku.id,
				},
			});
			console.log("Added to cart:", response.data);
			alert("Thêm vào giỏ hàng thành công!");
		} catch (error) {
			console.error("Error adding to cart:", error);
			alert("Có lỗi xảy ra khi thêm vào giỏ.");
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
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="grid md:grid-cols-2 gap-8">
					{/* Left Column - Product Image */}
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">{product.name}</h1>
						<div className="aspect-square relative">
							<img
								src={
									`https://localhost:7011/uploads/${selectedSku?.productId}/` +
									selectedSku?.imageName
								}
								// src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-xiaomi-redmi-note-14_2__2.png"
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
										onClick={() =>
											handleColorSelection(color)
										}
									>
										{color}
									</div>
								))}
							</div>

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
							<button
								onClick={handleBuyNow}
								className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
							>
								Mua ngay
							</button>
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

						{/* Product Features */}
						{/* <div className="space-y-4">
							<h2 className="text-lg font-bold">
								Đặc điểm nổi bật của iPhone 12
							</h2>
							<div
								className={`space-y-2 overflow-hidden transition-all duration-300 ${
									isExpanded ? "max-h-[200px]" : "max-h-30"
								}`}
							>
								<h3 className="font-medium">
									Thiết kế mỏng nhẹ, nhỏ gọn và đẳng cấp
								</h3>
								<p className="text-gray-700 text-sm">
									iPhone 12 đã có sự đột phá về thiết kế với
									kiểu dáng mới vuông vắn, mạnh mẽ và sang
									trọng hơn. Không chỉ vậy, iPhone 12 mỏng hơn
									11% và nhẹ hơn 16% so với thế hệ trước
									iPhone 11. Lorem ipsum dolor sit amet
									consectetur adipisicing elit. Iure adipisci
									quibusdam atque error accusantium! Quia.
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Quam est quisquam
									veritatis? Nemo cum recusandae, optio error
									corrupti ab amet!
								</p>
							</div>
							<button
								className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								{isExpanded ? "Thu gọn" : "Xem thêm"}
								<ChevronDown
									className={`transform transition-transform w-4 h-4 ${
										isExpanded ? "rotate-180" : ""
									}`}
								/>
							</button>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
}

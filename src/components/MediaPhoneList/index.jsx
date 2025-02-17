import { useEffect, useState } from "react";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router";
import axios from "axios";

const priceRanges = [
	{ id: "all", label: "Tất cả" },
	{ id: "under5m", label: "Dưới 5 triệu" },
	{ id: "5mto9m", label: "Từ 5 đến 9 triệu" },
	{ id: "9mto15m", label: "Từ 9 đến 15 triệu" },
	{ id: "15mto20m", label: "Từ 15 đến 20 triệu" },
	{ id: "above20m", label: "Trên 20 triệu" },
];

export default function MediaPhoneList() {
	const [selectedPriceRange, setSelectedPriceRange] = useState("all");
	const [showAll, setShowAll] = useState(false);
	const [sortOrder, setSortOrder] = useState("default");

	const { brand } = useParams(); // Lấy branch từ URL params
	const [allProducts, setAllProducts] = useState([]);

	useEffect(() => {
		if (!brand) return;

		// Bước 1: Lấy branchID từ tên branch
		axios
			.get("/Brands")
			.then((brandRes) => {
				const brandData = brandRes.data;
				const foundBrand = brandData.find(
					(b) => b.name.toLowerCase() === brand.toLowerCase()
				);

				if (!foundBrand) {
					console.log("Không tìm thấy thương hiệu");
					return;
				}

				const brandID = foundBrand.id;

				// Bước 2: Gọi API lấy danh sách sản phẩm theo brandID
				return Promise.all([
					axios.get("/Products"),
					axios.get("/Product_SKU"),
					axios.get("/Product_Image"),
				]).then(([productsRes, skusRes, imagesRes]) => {
					const allProducts = productsRes.data;
					const allSkus = skusRes.data;
					const allImages = imagesRes.data;

					// Bước 3: Lọc sản phẩm theo brandID
					const filteredProducts = allProducts.filter(
						(product) => product.brandId === brandID
					);

					console.log(filteredProducts);

					// Bước 4: Chuyển SKU & Images thành Map để tìm kiếm nhanh
					const skuMap = allSkus.reduce((acc, sku) => {
						acc[sku.productId] = sku;
						return acc;
					}, {});

					const imageMap = allImages.reduce((acc, image) => {
						acc[image.productId] = image;
						return acc;
					}, {});

					// Bước 5: Merge dữ liệu sản phẩm
					const mergedProducts = filteredProducts.map((product) => ({
						...product,
						sku: skuMap[product.id] || null,
						image: imageMap[product.id] || null,
					}));

					setAllProducts(mergedProducts);
				});
			})
			.catch((err) => {
				console.error("Lỗi tải dữ liệu:", err);
			});
	}, [brand]);

	console.log(allProducts);

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + " đ";
	};

	const filterProducts = (products) => {
		if (selectedPriceRange === "all") return products;

		const ranges = {
			under5m: [0, 5000000],
			"5mto9m": [5000000, 9000000],
			"9mto15m": [9000000, 15000000],
			"15mto20m": [15000000, 20000000],
			above20m: [20000000, Number.POSITIVE_INFINITY],
		};

		const [min, max] = ranges[selectedPriceRange] || [
			0,
			Number.POSITIVE_INFINITY,
		];
		return products.filter(
			(product) =>
				product.sku.defaultPrice >= min &&
				product.sku.defaultPrice <= max
		);
	};

	const sortProducts = (products) => {
		const sorted = [...products];
		switch (sortOrder) {
			case "price-asc":
				return sorted.sort(
					(a, b) => a.sku.defaultPrice - b.sku.defaultPrice
				);
			case "price-desc":
				return sorted.sort(
					(a, b) => b.sku.defaultPrice - a.sku.defaultPrice
				);
			default:
				return sorted;
		}
	};

	const filteredProducts = sortProducts(filterProducts(allProducts));
	const displayedProducts = showAll
		? filteredProducts
		: filteredProducts.slice(0, 3);

	return (
		<div className="container mx-auto px-10 py-8">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Price Filter Sidebar */}
				<div className="space-y-4">
					<h2 className="font-bold text-lg mb-4">Mức giá</h2>
					{priceRanges.map((range) => (
						<label
							key={range.id}
							className="flex items-center space-x-2 cursor-pointer"
						>
							<input
								type="radio"
								name="price-range"
								checked={selectedPriceRange === range.id}
								onChange={() => setSelectedPriceRange(range.id)}
								className="rounded-full"
							/>
							<span>{range.label}</span>
						</label>
					))}
				</div>

				{/* Product Grid */}
				<div className="md:col-span-3">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-xl font-bold">
							{brand} ({filteredProducts.length} sản phẩm)
						</h1>
						<select
							className="border rounded-md px-3 py-1"
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}
						>
							<option value="default">Sắp xếp</option>
							<option value="price-asc">Giá tăng dần</option>
							<option value="price-desc">Giá giảm dần</option>
						</select>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{displayedProducts.map((product) => (
							<div
								key={product.id}
								className="border rounded-lg p-4 bg-white"
							>
								<img
									src={
										"https://localhost:7011/uploads/" +
											product.image.imageName ||
										"/placeholder.svg"
									}
									alt={product.name}
									className="w-full h-48 object-contain mb-4"
								/>
								<h3 className="font-semibold text-center mb-2">
									{product.name}
								</h3>
								<p className="text-red-600 font-bold text-center mb-4">
									{formatPrice(
										product.sku?.finalPrice ||
											product.sku?.defaultPrice
									)}
								</p>
								<div className="grid grid-cols-2 gap-2">
									<Link to={`/product/${product.id}`}>
										<button className="flex items-center justify-center gap-1 w-full px-3 py-2 border rounded-md hover:bg-gray-50">
											<Search className="w-4 h-4" />
											Xem
										</button>
									</Link>
									<Link>
										<button className="flex items-center justify-center gap-1 w-full px-3 py-2 border rounded-md hover:bg-gray-50">
											<ShoppingCart className="w-4 h-4" />
											Thêm vào
										</button>
									</Link>
								</div>
							</div>
						))}
					</div>

					{filteredProducts.length > 3 && !showAll && (
						<div className="text-center mt-8">
							<button
								onClick={() => setShowAll(true)}
								className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
							>
								Xem thêm
								<ChevronDown className="w-4 h-4" />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

import Slider from "react-slick";
import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router";

const CustomPrevArrow = ({ onClick }) => (
	<button
		onClick={onClick}
		className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
	>
		<ChevronLeft className="h-6 w-6" />
	</button>
);

const priceRanges = [
	{ id: "all", label: "Tất cả" },
	{ id: "under5m", label: "Dưới 5 triệu" },
	{ id: "5mto9m", label: "Từ 5 đến 9 triệu" },
	{ id: "9mto15m", label: "Từ 9 đến 15 triệu" },
	{ id: "15mto20m", label: "Từ 15 đến 20 triệu" },
	{ id: "above20m", label: "Trên 20 triệu" },
];

const CustomNextArrow = ({ onClick }) => (
	<button
		onClick={onClick}
		className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
	>
		<ChevronRight className="h-6 w-6" />
	</button>
);

export default function Homepage() {
	const [products, setProducts] = useState([]);
	const [brands, setBrands] = useState([]);
	const [selectedPriceRange, setSelectedPriceRange] = useState("all");
	const [showAll, setShowAll] = useState(false);
	const [sortOrder, setSortOrder] = useState("default");
	const [seachProducts, setSeachProducts] = useState([]);

	const { selectedBrand, productSectionRef, productSearchRef, keyword } =
		useOutletContext();

	const bannerSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	};

	useEffect(() => {
		Promise.all([
			axios.get("/Products"),
			axios.get("/Product_Image"),
			axios.get("/Product_SKU"),
			axios.get("/Brands"),
		])
			.then(([productsRes, imagesRes, skusRes, brandsRes]) => {
				const products = productsRes.data;
				const images = imagesRes.data;
				const skus = skusRes.data;
				setBrands(brandsRes.data);

				// Chuyển đổi dữ liệu thành object map để tra cứu nhanh
				const imageMap = images.reduce((acc, image) => {
					acc[image.productId] = image;
					return acc;
				}, {});

				// Gộp dữ liệu dựa trên ProductId
				const mergedProducts = products.map((product) => ({
					...product,
					// images: images.filter(
					// 	(img) => img.productId === product.id
					// ),
					images: imageMap[product.id] || {},
					skus: skus.filter((sku) => sku.productId === product.id),
				}));
				setProducts(mergedProducts);
			})
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	}, []);

	console.log(products);

	useEffect(() => {
		// Bước 1: Lấy danh sách sản phẩm từ keyword
		axios
			.get(`/Products/search?keyword=${keyword}`)
			.then((searchProductRes) => {
				const searchProduct = searchProductRes.data;

				// Bước 2: Gọi API lấy danh sách sản phẩm theo ProductId
				return Promise.all([
					axios.get("/Product_SKU"),
					axios.get("/Product_Image"),
				]).then(([skusRes, imagesRes]) => {
					const allSkus = skusRes.data;
					const allImages = imagesRes.data;

					// Bước 3: Chuyển SKU & Images thành Map để tìm kiếm nhanh
					// const skuMap = allSkus.reduce((acc, sku) => {
					// 	acc[sku.productId] = sku;
					// 	return acc;
					// }, {});

					const imageMap = allImages.reduce((acc, image) => {
						acc[image.productId] = image;
						return acc;
					}, {});

					// Bước 5: Merge dữ liệu sản phẩm
					const mergedProducts = searchProduct.map((product) => ({
						...product,
						// skus: skuMap[product.id] || null,
						// images: imageMap[product.id] || null,
						images: imageMap[product.id] || {},
						skus: allSkus.filter(
							(sku) => sku.productId === product.id
						),
					}));

					setSeachProducts(mergedProducts);
				});
			})
			.catch((err) => {
				console.error("Lỗi tải dữ liệu:", err);
			});
	}, [keyword]);

	console.log("searchProducts", seachProducts);

	const filterProducts = (products) => {
		let filtered = [...products];

		// Lọc theo thương hiệu
		if (selectedBrand !== "all") {
			const brandId = brands.find(
				(b) => b?.name?.toLowerCase() === selectedBrand?.toLowerCase()
			)?.id;
			filtered = filtered.filter(
				(product) => product.brandId === brandId
			);
		}

		// Lọc theo giá
		if (selectedPriceRange !== "all") {
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
			filtered = filtered.filter((product) => {
				const price = product?.skus[0]?.defaultPrice || 0;
				return price >= min && price <= max;
			});
		}

		// Sắp xếp sản phẩm
		switch (sortOrder) {
			case "price-asc":
				filtered.sort(
					(a, b) =>
						(a?.skus[0]?.defaultPrice || 0) -
						(b?.skus[0]?.defaultPrice || 0)
				);
				break;
			case "price-desc":
				filtered.sort(
					(a, b) =>
						(b?.skus[0]?.defaultPrice || 0) -
						(a?.skus[0]?.defaultPrice || 0)
				);
				break;
			default:
				break;
		}

		return filtered;
	};

	const filteredProducts = filterProducts(keyword ? seachProducts : products);
	const displayedProducts = showAll
		? filteredProducts
		: filteredProducts.slice(0, 8);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Banner Slider */}
			<div className="mb-12">
				<Slider {...bannerSettings}>
					<div className="px-1">
						<img
							src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ba/41/ba415d5d06238f5db1b8ddb6be96f912.png"
							alt="Slibar 1"
							className="w-full h-[500px] object-cover rounded-lg"
						/>
					</div>
					<div className="px-1">
						<img
							src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b3/ce/b3ce717a1c17f16577fa1ca990300272.png"
							alt="Slibar 2"
							className="w-full h-[500px] object-cover rounded-lg"
						/>
					</div>
				</Slider>
			</div>

			{/* Hot Promotions Section */}
			<div ref={productSectionRef || productSearchRef} className="mb-12">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center">
						<div className="mr-2 h-6 w-1 bg-red-600"></div>
						<h2 className="text-2xl font-bold text-red-600">
							SẢN PHẨM
						</h2>
					</div>
					<div className="flex gap-4">
						<select
							className="rounded-md border px-3 py-2"
							value={selectedPriceRange}
							onChange={(e) =>
								setSelectedPriceRange(e.target.value)
							}
						>
							{/* <option value="all">Mức giá</option> */}
							{priceRanges.map((range) => (
								<option
									key={range.id}
									value={range?.id?.toLowerCase()}
								>
									{range.label}
								</option>
							))}
						</select>
						<select
							className="rounded-md border px-3 py-2"
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}
						>
							<option value="default">Sắp xếp</option>
							<option value="price-asc">Giá tăng dần</option>
							<option value="price-desc">Giá giảm dần</option>
						</select>
					</div>
				</div>

				{/* Price Filter Sidebar */}
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
					{displayedProducts.map((product, index) => (
						<ProductCard key={index} {...product} />
					))}
				</div>
				{filteredProducts.length > 8 && !showAll && (
					<div className="text-center mt-8">
						<button
							onClick={() => setShowAll(true)}
							className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 cursor-pointer"
						>
							Xem thêm
							<ChevronDown className="w-4 h-4" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

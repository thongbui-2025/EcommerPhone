import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomPrevArrow = ({ onClick }) => (
	<button
		onClick={onClick}
		className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
	>
		<ChevronLeft className="h-6 w-6" />
	</button>
);

const CustomNextArrow = ({ onClick }) => (
	<button
		onClick={onClick}
		className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
	>
		<ChevronRight className="h-6 w-6" />
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

export default function Homepage() {
	const [products, setProducts] = useState([]);
	const [brands, setBrands] = useState([]);
	const [selectedPriceRange, setSelectedPriceRange] = useState("all");
	const [sortOrder, setSortOrder] = useState("default");
	const [searchProducts, setSearchProducts] = useState([]);
	const [visibleCount, setVisibleCount] = useState(8);

	// Sản phẩm yêu thích
	const [isFavorite, setIsFavorite] = useState([]);

	const { selectedBrand, productSectionRef, productSearchRef, keyword } =
		useOutletContext();

	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("token");

	const location = useLocation();

	const bannerSettings = {
		dots: true,
		infinite: true,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		fade: true, // Dùng fade thay vì slide
		// beforeChange: (current, next) => {
		// 	// Kiểm soát animation nếu cần
		// 	console.log("Slide từ", current, "->", next);
		// },
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	};

	useEffect(() => {
		if (location.state?.scrollToProduct) {
			productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [location, productSectionRef]);

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

					const imageMap = allImages.reduce((acc, image) => {
						acc[image.productId] = image;
						return acc;
					}, {});

					// Bước 3: Merge dữ liệu sản phẩm
					const mergedProducts = searchProduct.map((product) => ({
						...product,
						images: imageMap[product.id] || {},
						skus: allSkus.filter(
							(sku) => sku.productId === product.id
						),
					}));

					setSearchProducts(mergedProducts);
				});
			})
			.catch((err) => {
				console.error("Lỗi tải dữ liệu:", err);
			});
	}, [keyword]);

	// console.log("searchProducts", searchProducts);

	// Logic save state Favorites
	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await axios.get(
					`/Products/wishlist/${userId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setIsFavorite(response.data); // chứa danh sách yêu thích từ server
			} catch (error) {
				console.error("Lỗi khi tải danh sách yêu thích:", error);
			}
		};

		fetchFavorites();
	}, [userId, token]);

	const filterProducts = (products) => {
		let filtered = [...products];

		// Lọc theo thương hiệu
		if (selectedBrand !== 0) {
			filtered = filtered.filter(
				(product) => product.brandId === selectedBrand
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
				const price = product?.skus[0]?.finalPrice || 0;
				return price >= min && price <= max;
			});
		}

		// Sắp xếp sản phẩm
		switch (sortOrder) {
			case "price-asc":
				filtered.sort(
					(a, b) =>
						(a?.skus[0]?.finalPrice || 0) -
						(b?.skus[0]?.finalPrice || 0)
				);
				break;
			case "price-desc":
				filtered.sort(
					(a, b) =>
						(b?.skus[0]?.finalPrice || 0) -
						(a?.skus[0]?.finalPrice || 0)
				);
				break;
			default:
				break;
		}

		return filtered;
	};

	const baseProducts = keyword ? searchProducts : products;

	// console.log("baseProducts", baseProducts);

	const filteredProducts = filterProducts(
		baseProducts.filter(
			(product) => !selectedBrand || product.brandId === selectedBrand
		)
	);

	// console.log("filteredProducts", filteredProducts);

	const displayedProducts = filteredProducts.slice(0, visibleCount);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 8);
	};

	// Handle sản phẩm tym
	const toggleFavorite = async (product) => {
		try {
			console.log("token", token);

			await axios.post(
				`/Products/wishlist?userId=${userId}&productId=${product.id}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const isFav = isFavorite.some((item) => item.id === product.id);
			if (isFav) {
				setIsFavorite((prev) =>
					prev.filter((item) => item.id !== product.id)
				);
				console.log("Đã xóa khỏi danh sách yêu thích 💔");
			} else {
				setIsFavorite((prev) => [...prev, product]);
				console.log("Đã thêm vào danh sách yêu thích ❤️");
			}
		} catch (error) {
			console.error("Lỗi khi gửi yêu cầu yêu thích:", error);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Banner Slider */}
			<div className="mb-12 overflow-hidden rounded-lg">
				<Slider {...bannerSettings}>
					<div className="px-1 overflow-hidden rounded-lg">
						<img
							src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ba/41/ba415d5d06238f5db1b8ddb6be96f912.png"
							alt="Slider 1"
							className="w-full h-[500px] object-cover rounded-lg"
						/>
					</div>
					<div className="px-1 overflow-hidden rounded-lg">
						<img
							src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b3/ce/b3ce717a1c17f16577fa1ca990300272.png"
							alt="Slider 2"
							className="w-full h-[500px] object-cover rounded-lg"
						/>
					</div>
					<div className="px-1 overflow-hidden rounded-lg">
						<img
							src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/1a/f8/1af8b112ae6b4c90162e0bf4f79b52c1.png"
							alt="Slider 3"
							className="w-full h-[500px] object-cover rounded-lg"
						/>
					</div>
				</Slider>
			</div>

			{/* Hot Promotions Section */}
			<div
				ref={(el) => {
					productSectionRef.current = el;
					productSearchRef.current = el;
				}}
				className="mb-12"
			>
				<div
					// ref={productSearchRef}
					className="mb-6 flex items-center justify-between"
				>
					<div className="flex items-center">
						<div className="mr-2 h-6 w-1 bg-red-600"></div>
						<h2 className="text-2xl font-bold text-red-600 mr-6">
							SẢN PHẨM
						</h2>
						<p className="text-2xl font-bold">
							{brands.find((b) => b?.id === selectedBrand)?.name}{" "}
							({filteredProducts.length} sản phẩm)
						</p>
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
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 space-y-8">
					{displayedProducts.map((product, index) => (
						<ProductCard
							key={index}
							product={product}
							isFavorite={isFavorite}
							toggleFavorite={toggleFavorite}
							heart={true}
						/>
					))}
				</div>
				{filteredProducts.length > visibleCount && (
					<div className="text-center mt-8">
						<button
							onClick={handleShowMore}
							className="inline-flex items-center gap-2 px-4 py-2 border rounded-md font-semibold hover:bg-gray-50 cursor-pointer"
						>
							Xem thêm
							<span className="text-[#6DD5ED]">
								{filteredProducts.length - visibleCount} sản
								phẩm
							</span>
							<ChevronDown className="w-4 h-4 text-[#6DD5ED]" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

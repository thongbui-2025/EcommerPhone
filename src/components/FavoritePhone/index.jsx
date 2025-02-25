import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { ChevronDown } from "lucide-react";

const FavoritePhone = () => {
	const [productsWishlist, setProductsWishlist] = useState(null);
	const [visibleCount, setVisibleCount] = useState(8);
	const userId = localStorage.getItem("userId");

	useEffect;

	useEffect(() => {
		Promise.all([
			axios.get(`/Products/wishlist/${userId}`),
			axios.get("/Product_Image"),
			axios.get("/Product_SKU"),
		])
			.then(([productsWishlistRes, imagesRes, skusRes]) => {
				const productsWishlist = productsWishlistRes.data;
				const images = imagesRes.data;
				const skus = skusRes.data;

				// Chuyển đổi dữ liệu thành object map để tra cứu nhanh
				const imageMap = images.reduce((acc, image) => {
					acc[image.productId] = image;
					return acc;
				}, {});

				// Gộp dữ liệu dựa trên ProductId
				const mergedProducts = productsWishlist.map((product) => ({
					...product,
					images: imageMap[product.id] || {},
					skus: skus.filter((sku) => sku.productId === product.id),
				}));
				setProductsWishlist(mergedProducts);
			})
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	}, [userId]);

	console.log("productsWishlist", productsWishlist);

	const displayedProducts = productsWishlist?.slice(0, visibleCount);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + 8);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Hot Promotions Section */}
			<div className="mb-12">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center">
						<div className="mr-2 h-6 w-1 bg-red-600"></div>
						<h2 className="text-2xl font-bold text-red-600 mr-6">
							SẢN PHẨM YÊU THÍCH
						</h2>
					</div>
				</div>

				{/* Price Filter Sidebar */}
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
					{displayedProducts?.map((product, index) => (
						<ProductCard
							key={index}
							product={product}
							heart={false}
						/>
					))}
				</div>
				{productsWishlist?.length > visibleCount && (
					<div className="text-center mt-8">
						<button
							onClick={handleShowMore}
							className="inline-flex items-center gap-2 px-4 py-2 border rounded-md font-semibold hover:bg-gray-50 cursor-pointer"
						>
							Xem thêm
							<span className="text-[#6DD5ED]">
								{productsWishlist.length - visibleCount} sản
								phẩm
							</span>
							<ChevronDown className="w-4 h-4 text-[#6DD5ED]" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default FavoritePhone;

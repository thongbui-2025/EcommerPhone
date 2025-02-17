import Slider from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";

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

export default function Homepage() {
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

	const productSettings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

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

				// Chuyển đổi dữ liệu thành object map để tra cứu nhanh
				// 				const skuMap = skus.reduce((acc, sku) => {
				// 					acc[sku.id] = sku;
				// 					return acc;
				// 				}, {});
				// 				// console.log("skuMap", skuMap);
				//
				// 				const productMap = products.reduce((acc, product) => {
				// 					acc[product.id] = product;
				// 					return acc;
				// 				}, {});
				// 				// console.log("productMap", productMap);
				//
				// 				const imageMap = images.reduce((acc, image) => {
				// 					acc[image.productId] = image;
				// 					return acc;
				// 				}, {});

				// Gộp dữ liệu dựa trên ProductId
				const mergedProducts = products.map((product) => ({
					...product,
					images: images.filter(
						(img) => img.productId === product.id
					),
					skus: skus.filter((sku) => sku.productId === product.id),
				}));

				setProducts(mergedProducts);
			})
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	}, []);

	console.log(products);

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
			<div className="mb-12">
				<div className="mb-6 flex items-center">
					<div className="mr-2 h-6 w-1 bg-red-600"></div>
					<h2 className="text-2xl font-bold text-red-600">
						SẢN PHẨM HOT
					</h2>
				</div>

				<Slider {...productSettings}>
					{products.map((product, index) => (
						<ProductCard key={index} {...product} />
					))}
				</Slider>
			</div>
		</div>
	);
}

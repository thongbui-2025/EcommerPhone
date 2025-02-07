import Slider from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../../components/ProductCard";

const CustomPrevArrow = (props) => (
	<button
		{...props}
		className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md"
	>
		<ChevronLeft className="h-6 w-6" />
	</button>
);

const CustomNextArrow = (props) => (
	<button
		{...props}
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

	const products = [
		{
			id: 1,
			image: "https://cdn.tgdd.vn/Products/Images/42/213031/TimerThumb/iphone-12-(76).jpg",
			name: "Iphone 12",
			price: "27.990.000 đ",
		},
		{
			id: 2,
			image: "https://cdn.tgdd.vn/Products/Images/42/311354/TimerThumb/oppo-a58-4g-(24).jpg",
			name: "Oppo",
			price: "10.990.000 đ",
		},
		{
			id: 3,
			image: "https://cdn.tgdd.vn/Products/Images/42/329007/xiaomi-redmi-14c-black-1-600x600.jpg",
			name: "Xiaomi",
			price: "5.499.000 đ",
		},
		{
			id: 4,
			image: "https://cdn.tgdd.vn/Products/Images/42/328750/TimerThumb/samsung-galaxy-a06-6gb-128gb-(8).jpg",
			name: "Samsung",
			price: "19.499.000 đ",
		},
		{
			image: "https://cdn.tgdd.vn/Products/Images/522/322130/samsung-galaxy-tab-s10-plus-sliver-thumb-600x600.jpg",
			name: "Iphone X series",
			price: "19.499.000 đ",
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Banner Slider */}
			<div className="mb-12">
				<Slider {...bannerSettings}>
					<div className="px-1">
						<img
							src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ba/41/ba415d5d06238f5db1b8ddb6be96f912.png"
							alt="Slibar 1"
							className="w-full rounded-lg object-cover"
						/>
					</div>
					<div className="px-1">
						<img
							src="//cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b3/ce/b3ce717a1c17f16577fa1ca990300272.png"
							alt="Slibar 2"
							className="w-full rounded-lg object-cover"
						/>
					</div>
				</Slider>
			</div>

			{/* Hot Promotions Section */}
			<div className="mb-12">
				<div className="mb-6 flex items-center">
					<div className="mr-2 h-6 w-1 bg-red-600"></div>
					<h2 className="text-2xl font-bold text-red-600">
						KHUYẾN MÃI HOT
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

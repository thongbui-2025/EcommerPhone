// import { SearchCode, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { formatPrice } from "../utils/formatPrice";
import { Heart } from "lucide-react";
import { useState } from "react";
import {
	discountPercentage,
	lowestDefaultPrice,
	lowestFinalPrice,
} from "../utils/getLowestPrice";

const ProductCard = ({ id, images, name, skus = [] }) => {
	// console.log(images?.imageName);
	// console.log(skus);

	const [isFavorite, setIsFavorite] = useState(false);

	const handleFavorite = (e) => {
		e.preventDefault(); //
		setIsFavorite(!isFavorite);
	};

	return (
		<Link to={`/product/${id}`}>
			<div className="mx-2 rounded-lg bg-white p-4 shadow-md hover:opacity-80 cursor-pointer">
				<div className="relative flex justify-center items-center">
					<div className="w-[18vw] md:h-[45vh] h-[35vh] rounded-lg overflow-hidden">
						<img
							src={
								images?.imageName
									? `https://localhost:7011/uploads/${id}/${images.imageName}`
									: "/productNoImage.svg"
							}
							alt={name}
							className="w-[18vw] md:h-[45vh] h-[35vh] rounded-lg object-contain"
						/>
					</div>
					<div className="absolute top-0 right-0">
						<button
							onClick={handleFavorite}
							className="rounded-full bg-white shadow-md cursor-pointer hover:scale-110"
						>
							<Heart
								className={`h-5 w-5 transition-colors ${
									isFavorite
										? "fill-red-600 stroke-red-600"
										: "stroke-gray-600"
								}`}
							/>
						</button>
					</div>
				</div>
				<div className="mt-4 text-center">
					<h3 className="text-lg font-semibold mb-1">{name}</h3>
					<p className="text-red-600  text-xl font-bold mb-1">
						{formatPrice(lowestFinalPrice(skus)) || 0}
					</p>
					<div className="flex justify-center gap-3">
						<p className="text-[#a4a4a4] text-sm line-through font-normal">
							{formatPrice(lowestDefaultPrice(skus)) || 0}
						</p>
						<span className="text-red-500 text-sm">
							-{discountPercentage(skus) || 0}%
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;

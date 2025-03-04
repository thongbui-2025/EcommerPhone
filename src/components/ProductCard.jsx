import { Link } from "react-router";
import { formatPrice } from "../utils/formatPrice";
import { Heart } from "lucide-react";
import {
	discountPercentage,
	lowestDefaultPrice,
	lowestFinalPrice,
} from "../utils/getLowestPrice";

const ProductCard = ({ product, isFavorite, toggleFavorite, heart }) => {
	const userId = localStorage.getItem("userId");
	// console.log(images?.imageName);
	// console.log(skus);

	const favorites = isFavorite?.some((item) => item?.id === product?.id);

	return (
		<Link to={`/product/${product.id}`}>
			<div className="group mx-2 rounded-lg bg-white p-4 shadow-md hover:opacity-90 cursor-pointer">
				<div className="relative flex justify-center items-center overflow-hidden">
					<div className="w-[18vw] md:h-[45vh] h-[35vh] rounded-lg overflow-hidden">
						<img
							src={
								product?.images?.imageName
									? `https://localhost:7011/uploads/${product.id}/${product?.images?.imageName}`
									: "/productNoImage.svg"
							}
							alt={product?.name}
							className="w-[18vw] md:h-[45vh] h-[35vh] rounded-lg object-contain transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-90"
						/>
					</div>
					<div className="absolute top-0 right-0">
						{userId && heart && (
							<button
								onClick={(e) => {
									e.preventDefault();
									toggleFavorite(product);
								}}
								className="rounded-full bg-white shadow-md cursor-pointer hover:scale-110"
							>
								<Heart
									className={`h-5 w-5 transition-colors ${
										favorites
											? "fill-red-600 stroke-red-600"
											: "stroke-gray-600"
									}`}
								/>
							</button>
						)}
					</div>
				</div>
				<div className="mt-4 text-center">
					<h3 className="text-lg font-semibold mb-1">
						{product?.name}
					</h3>
					<p className="text-red-600  text-xl font-bold mb-1">
						{formatPrice(lowestFinalPrice(product?.skus)) ||
							"Hết hàng"}
					</p>
					<div className="flex justify-center gap-3">
						<p className="text-[#a4a4a4] text-sm line-through font-normal">
							{formatPrice(lowestDefaultPrice(product?.skus))}
						</p>

						{discountPercentage(product?.skus) ? (
							<span className="text-red-500 text-sm">
								-{discountPercentage(product?.skus)}%
							</span>
						) : (
							<span className="text-red-500 text-sm">&nbsp;</span>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;

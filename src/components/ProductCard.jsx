import { SearchCode, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

const ProductCard = ({ id, image, name, price }) => (
	<div className="mx-2 rounded-lg bg-white p-4 shadow-md">
		<div className="relative">
			<img
				src={image || "/placeholder.svg"}
				alt={name}
				className="w-full rounded-lg object-cover"
			/>
			<div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-2 opacity-0 transition-opacity hover:opacity-100">
				<Link to={`/product/${id}`}>
					<button className="rounded-full bg-white p-2 shadow-md">
						<SearchCode className="h-5 w-5" />
					</button>
				</Link>
				<Link to="/cart">
					<button className="rounded-full bg-white p-2 shadow-md">
						<ShoppingCart className="h-5 w-5" />
					</button>
				</Link>
			</div>
		</div>
		<div className="mt-4 text-center">
			<h3 className="text-lg font-semibold">{name}</h3>
			<p className="text-red-600">{price}</p>
		</div>
	</div>
);

export default ProductCard;

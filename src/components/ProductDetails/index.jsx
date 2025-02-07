import { ChevronDown, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

const specifications = [
	{ label: "Màn hình:", value: '6.1", Super Retina XDR' },
	{ label: "Camera sau:", value: "12.0 MP + 12.0 MP" },
	{ label: "Camera Selfie:", value: "12.0 MP" },
	{ label: "RAM:", value: "4GB" },
	{ label: "Bộ nhớ trong:", value: "128 GB" },
	{ label: "CPU:", value: "A14 Bionic" },
	{ label: "Dung lượng pin:", value: "2815 mAh" },
	{ label: "Thẻ sim:", value: "2,1 eSIM, 1 Nano SIM" },
	{ label: "Hệ điều hành:", value: "iOS 14" },
];

export default function ProductDetails() {
	const [isExpanded, setIsExpanded] = useState(false);
	const { id } = useParams();
	console.log("productId:", id);

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="grid md:grid-cols-2 gap-8">
					{/* Left Column - Product Image */}
					<div className="space-y-6">
						<h1 className="text-2xl font-bold">iPhone 12 128GB</h1>
						<div className="aspect-square relative">
							<img
								src="/placeholder.svg"
								alt="iPhone 12"
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="text-center">
							<span className="text-3xl font-bold text-red-600">
								30.990.000 đ
							</span>
						</div>
						<p className="text-gray-700 text-sm">
							iPhone 12 ra mắt với vai trò mở ra một kỷ nguyên
							hoàn toàn mới. Tốc độ mạng 5G siêu tốc, bộ vi xử lý
							A14 Bionic mạnh nhất thế giới smartphone.
						</p>
						<div className="flex gap-4">
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
						</div>
					</div>

					{/* Right Column - Specifications */}
					<div>
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
						<div className="space-y-4">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

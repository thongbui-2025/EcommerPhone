import { Facebook } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
	return (
		<footer className="w-full bg-[#333333] text-white py-8 mt-auto">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Company Info Column */}
					<div className="space-y-4">
						<div className="flex flex-col md:items-center gap-2">
							<img
								src="/LogPhone.png"
								alt="LogPhone Logo"
								className="w-[8vw] h-[16vh]"
							/>
							<span className="text-xl font-bold">LogPhone</span>
						</div>
					</div>

					{/* Order Info Column */}
					<div className="space-y-2">
						<ul className="space-y-2">
							<li>
								<Link to="#" className="hover:text-gray-300">
									GIỚI THIỆU VỀ CÔNG TY
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									CÂU HỎI THƯỜNG GẶP
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									CHÍNH SÁCH BẢO MẬT
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									QUY CHẾ HOẠT ĐỘNG
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									TRA CỨU THÔNG TIN BẢO HÀNH
								</Link>
							</li>
						</ul>
					</div>

					{/* Warranty Info Column */}
					<div className="space-y-2">
						<ul className="space-y-2">
							<li>
								<Link to="#" className="hover:text-gray-300">
									HỆ THỐNG CỬA HÀNG
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									HỆ THỐNG BẢO HÀNH
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									KIỂM TRA HÀNG APPLE CHÍNH HÃNG
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									GIỚI THIỆU ĐỔI MÁY
								</Link>
							</li>
							<li>
								<Link to="#" className="hover:text-gray-300">
									CHÍNH SÁCH ĐỔI TRẢ
								</Link>
							</li>
						</ul>
					</div>

					{/* Social Media Column */}
					<div className="space-y-4">
						<h3 className="font-bold text-lg">SOCIAL MEDIA</h3>
						<div className="flex gap-4">
							<Link to="#" className="hover:text-gray-300">
								<Facebook className="w-8 h-8" />
							</Link>
							<Link to="#" className="hover:text-gray-300">
								<span className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:opacity-80 text-zinc-900">
									G
								</span>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-lg">LogPhone Shop</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

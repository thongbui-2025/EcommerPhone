import { ShoppingBag, Search, User, Clock, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Header = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
	return (
		<header className="w-full">
			<div className="container mx-auto ">
				<div className="flex items-center justify-between bg-[#333333] px-6">
					<div className="flex items-center gap-1">
						{/* Logo */}
						<Link to="/" className="flex items-center">
							<img
								src="/LogPhone.png"
								alt="LogPhone"
								width={60}
								height={60}
							/>
						</Link>

						{/* Search Bar */}
						<div className="hidden md:flex flex-1 max-w-xl mx-8 items-center gap-4">
							<div className="relative w-full bg-white rounded">
								<input
									type="search"
									placeholder="Nhập thứ cần tìm..."
									className="w-full pl-4 pr-10 p-1"
								/>
							</div>
							<div>
								<button
									size="icon"
									className="bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] text-white py-2 px-4 rounded"
								>
									<Search className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>

					{/* User Actions */}
					<div className="flex items-center gap-4 text-white">
						{/* Check loggedIn */}
						<span className="hidden md:inline-block font-semibold">
							Xin chào Hy
						</span>
						<div className="relative">
							<button
								onClick={toggleDropdown}
								className="hover:text-[#6DD5ED] transition-colors focus:outline-none cursor-pointer"
							>
								<User className="h-5 w-5" />
							</button>
							{isDropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
									<Link
										to="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={toggleDropdown}
									>
										<User className="inline-block mr-2 h-4 w-4" />
										Tài khoản của bạn
									</Link>
									<Link
										to="/purchase-history"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={toggleDropdown}
									>
										<Clock className="inline-block mr-2 h-4 w-4" />
										Lịch sử mua hàng
									</Link>
									<Link to="/login">
										<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
											<LogOut className="inline-block mr-2 h-4 w-4" />
											Đăng xuất
										</button>
									</Link>
								</div>
							)}
						</div>
						<Link to="/cart">
							<button
								size="icon"
								className="cursor-pointer hover:text-[#6DD5ED] transition-colors"
							>
								<ShoppingBag className="h-5 w-5" />
							</button>
						</Link>
					</div>
				</div>

				{/* Navigation */}
				<nav className="bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] pl-15">
					<ul className="flex items-center justify-start space-x-8 px-4 py-3 text-[#333333] font-semibold">
						<li>
							<Link to="/iphone" className="hover:opacity-80">
								IPHONE
							</Link>
						</li>
						<li>
							<Link to="/samsung" className="hover:opacity-80">
								SAMSUNG
							</Link>
						</li>
						<li>
							<Link to="/oppo" className="hover:opacity-80">
								OPPO
							</Link>
						</li>
						<li>
							<Link to="/huawei" className="hover:opacity-80">
								HUAWEI
							</Link>
						</li>
						<li>
							<Link to="/realme" className="hover:opacity-80">
								REALME
							</Link>
						</li>
						<li>
							<Link to="/vivo" className="hover:opacity-80">
								VIVO
							</Link>
						</li>
						<li>
							<Link to="/xiaomi" className="hover:opacity-80">
								XIAOMI
							</Link>
						</li>
						<li>
							<Link to="/nokia" className="hover:opacity-80">
								NOKIA
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;

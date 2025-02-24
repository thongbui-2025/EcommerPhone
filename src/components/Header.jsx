import axios from "axios";
import { ShoppingBag, Search, User, Clock, LogOut, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { logoutUser } from "../utils/auth";

const Header = ({ setSelectedBrand, setKeyword, keyChange, setKeyChange }) => {
	const [brands, setBrands] = useState([]);
	const [username, setUsername] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const searchRef = useRef(null);

	useEffect(() => {
		axios.get("Brands").then((response) => setBrands(response.data));
	}, []);

	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			setUsername(storedUsername);
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (searchRef.current && !searchRef.current.contains(e.target)) {
				setKeyChange("");
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	const handleKeyDown = (e) => {
		if (e.key == "Enter") {
			handleSearch();
		}
	};

	const handleSearch = () => {
		if (keyChange.trim() !== "") {
			setKeyword(keyChange);
		}
	};

	const handleLogout = () => {
		logoutUser();
	};

	return (
		<header className=" w-full max-lg:w-[1024px]">
			{/* <div className=""> */}
			<div className="flex items-center justify-between bg-[#333333] px-6">
				<div className="flex items-center gap-1">
					{/* Logo */}
					<Link
						to="/"
						onClick={() => {
							setKeyword("");
							setSelectedBrand("all");
						}}
						className="flex items-center"
					>
						<img
							src="/LogPhone.png"
							alt="LogPhone"
							width={60}
							height={60}
						/>
					</Link>
					{/* Search Bar */}
					<div
						ref={searchRef}
						className="hidden md:flex flex-1 max-w-xl mx-8 items-center gap-4"
					>
						<div className="relative w-full bg-white rounded">
							<input
								type="search"
								placeholder="Nhập thứ cần tìm..."
								value={keyChange}
								className="w-full pl-3 pr-3 p-1"
								onChange={(e) => setKeyChange(e.target.value)}
								onKeyDown={handleKeyDown}
							/>
						</div>
						<div>
							<button
								size="icon"
								className="bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] hover:opacity-90 text-white py-2 px-4 cursor-pointer rounded"
								onClick={handleSearch}
							>
								<Search className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				{/* User Actions */}
				<div className="flex items-center gap-4 text-white">
					{/* Check loggedIn */}
					{username ? (
						<span className="hidden md:inline-block font-semibold">
							{username}
						</span>
					) : (
						<Link to="/login" className="hover:text-[#6DD5ED]">
							Đăng nhập
						</Link>
					)}
					{username && (
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
										to="/favorite"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={toggleDropdown}
									>
										<Heart className="inline-block mr-2 h-4 w-4" />
										Sản phẩm yêu thích
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
										<button
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={handleLogout}
										>
											<LogOut className="inline-block mr-2 h-4 w-4" />
											Đăng xuất
										</button>
									</Link>
								</div>
							)}
						</div>
					)}
					<Link to="/cart" className="">
						<ShoppingBag className="h-5 w-5 cursor-pointer hover:text-[#6DD5ED] transition-colors" />
					</Link>
				</div>
			</div>

			{/* Navigation */}
			<nav className="bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] pl-15">
				<ul className="flex items-center justify-start space-x-8 px-4 py-3 text-[#333333] font-semibold">
					{brands.map((brand) => (
						<li key={brand.id}>
							<button
								onClick={() => setSelectedBrand(brand.name)}
								className="hover:opacity-80 cursor-pointer"
							>
								{brand.name}
							</button>
						</li>
					))}
				</ul>
			</nav>
			{/* </div> */}
		</header>
	);
};

export default Header;

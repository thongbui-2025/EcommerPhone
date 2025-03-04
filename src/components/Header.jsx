import axios from "axios";
import { ShoppingBag, Search, User, Clock, LogOut, Heart } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../utils/auth";

const Header = ({
	setSelectedBrand,
	setKeyword,
	keyChange,
	setKeyChange,
	productSearchRef,
}) => {
	const [brands, setBrands] = useState([]);
	const [username, setUsername] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const navigate = useNavigate();

	const [cartCount, setCartCount] = useState(() => {
		return parseInt(localStorage.getItem("cartCount")) || 0;
	});
	const cartId = localStorage.getItem("cartId");
	const token = localStorage.getItem("token");

	const dropdownRef = useRef(null);

	useEffect(() => {
		axios.get("Brands").then((response) => setBrands(response.data));
	}, []);

	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			setUsername(storedUsername);
		}
	}, []);

	// Lấy số lượng sản phẩm trong giỏ hàng
	useEffect(() => {
		axios
			.get(`/Cart_Item?cartId=${cartId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				setCartCount(response.data.length);
				localStorage.setItem("cartCount", response.data.length);
			})
			.catch((error) =>
				console.error("Error fetching cart data:", error)
			);
	}, [cartId, token]);

	// Lắng nghe sự kiện "cartUpdated"
	useEffect(() => {
		const updateCartCount = () => {
			axios
				.get(`/Cart_Item?cartId=${cartId}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setCartCount(response.data.length);
					localStorage.setItem("cartCount", response.data.length);
				})
				.catch((error) =>
					console.error("Error fetching cart data:", error)
				);
		};

		window.addEventListener("cartUpdated", updateCartCount);

		return () => window.removeEventListener("cartUpdated", updateCartCount);
	}, [cartId, token]);

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
	// Đóng dropdown khi click ra ngoài
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Xử lý khi nhấn Search hoặc Enter
	const handleSearch = () => {
		if (keyChange.trim() !== "") {
			setKeyword(keyChange); // Cập nhật keyword
		}
	};

	// Xử lý khi nhấn Enter
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Hàm clear input và reset keyword
	const handleClear = () => {
		setKeyChange("");
		setKeyword("");
		// Scroll về lại vị trí sản phẩm
		productSearchRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleLogout = () => {
		logoutUser();
	};

	const handleClickAll = () => {
		setSelectedBrand(0, true);
		navigate("/");
	};

	return (
		<header ref={dropdownRef} className="w-full max-w-screen-2xl mx-auto">
			{/* <div className=""> */}
			<div
				ref={dropdownRef}
				className="flex items-center justify-between bg-[#333333] px-6"
			>
				<div className="flex items-center gap-1">
					{/* Logo */}
					<Link
						to="/"
						onClick={() => {
							setKeyword("");
							setSelectedBrand(0, false);
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
					<div className="hidden md:flex flex-1 max-w-xl mx-8 items-center gap-4">
						<div className="relative w-full bg-white rounded">
							<input
								type=""
								placeholder="Nhập thứ cần tìm..."
								value={keyChange}
								className="w-full pl-3 pr-3 p-1"
								onChange={(e) => {
									const value = e.target.value;
									setKeyChange(value);
									if (value === "") {
										setKeyword(""); // Reset keyword nếu input rỗng
									}
								}}
								onKeyDown={handleKeyDown}
							/>
							{/* Nút Clear */}
							{keyChange && (
								<button
									className="absolute right-5 top-1/2 transform -translate-y-1/2 text-black"
									onClick={handleClear}
								>
									✕
								</button>
							)}
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
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
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
					<Link to="/cart" className="relative">
						<ShoppingBag className="h-5 w-5 cursor-pointer hover:text-[#6DD5ED] transition-colors" />
						{cartCount > 0 && (
							<span className="absolute -top-2 -right-2 bg-[#6DD5ED] text-white text-xs font-semibold px-1 rounded-full">
								{cartCount}
							</span>
						)}
					</Link>
				</div>
			</div>

			{/* Navigation */}
			<nav className="bg-gradient-to-r from-[#2193B0] to-[#6DD5ED] pl-15">
				<ul className="flex items-center justify-start space-x-8 px-4 py-3 text-[#333333] font-semibold">
					<li>
						<button
							onClick={handleClickAll}
							className="hover:opacity-80 cursor-pointer"
						>
							All
						</button>
					</li>
					{brands.map((brand) => (
						<li key={brand.id}>
							<button
								onClick={() => {
									setSelectedBrand(brand.id);
									navigate("/");
								}}
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

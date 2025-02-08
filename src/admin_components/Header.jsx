import { LogOut, User } from "lucide-react";
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
						<Link to="/admin" className="flex items-center">
							<img
								src="/LogPhone.png"
								alt="LogPhone"
								width={60}
								height={60}
							/>
						</Link>
					</div>

					{/* User Actions */}
					<div className="flex items-center gap-4 text-white">
						{/* Check loggedIn */}
						<span className="hidden md:inline-block font-semibold">
							Admin
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
									{/* <Link
										to="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={toggleDropdown}
									>
										<User className="inline-block mr-2 h-4 w-4" />
										Tài khoản của bạn
									</Link> */}
									<Link to="/login/admin">
										<button
											onClick={toggleDropdown}
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											<LogOut className="inline-block mr-2 h-4 w-4" />
											Đăng xuất
										</button>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;

import { useEffect, useState } from "react";
// import ProductManagement from "./ProductManagement";
// import CategoryManagement from "./CategoryManagement";
// import OrderManagement from "./OrderManagement";
// import CustomerManagement from "./CustomerManagement";
import { isAdmin } from "../../utils/auth";
import { Link, useNavigate } from "react-router";

export default function AdminPage({ activeTab, setActiveTab }) {
	const navigate = useNavigate();
	const [authorized, setAuthorized] = useState(null); // Kiểm tra trạng thái quyền

	useEffect(() => {
		if (!isAdmin()) {
			alert("Bạn không có quyền truy cập!");
			navigate("/login/admin");
		} else {
			setAuthorized(true); // Nếu là admin thì cho phép hiển thị trang
		}
	}, [navigate]);

	// Khi trạng thái chưa xác định (đang kiểm tra quyền), không hiển thị giao diện
	if (authorized === null) {
		return null; // Hoặc có thể hiển thị màn hình loading
	}

	return (
		<div className="bg-gray-100">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<Link
									to={"/productManagement"}
									onClick={() => setActiveTab("products")}
								>
									<span className="text-xl font-bold">
										Admin Dashboard
									</span>
								</Link>
							</div>
							<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
								<Link
									to={"/productManagement"}
									onClick={() => setActiveTab("products")}
									className={`${
										activeTab === "products"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Products
								</Link>
								<Link
									to={"/categoryManagement"}
									onClick={() => setActiveTab("categories")}
									className={`${
										activeTab === "categories"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Categories
								</Link>
								<Link
									to={"/orderManagement"}
									onClick={() => setActiveTab("order")}
									className={`${
										activeTab === "order"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Order
								</Link>
								<Link
									to={"/customerManagement"}
									onClick={() => setActiveTab("customer")}
									className={`${
										activeTab === "customer"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Customer
								</Link>
								<Link
									to={"/revenueReport"}
									onClick={() => setActiveTab("revenue")}
									className={`${
										activeTab === "revenue"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									RevenuReport
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
}

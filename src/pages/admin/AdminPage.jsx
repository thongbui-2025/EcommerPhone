import { useEffect, useState } from "react";
import ProductManagement from "./ProductManagement";
import CategoryManagement from "./CategoryManagement";
import OrderManagement from "./OrderManagement";
import CustomerManagement from "./CustomerManagement";
import { isAdmin } from "../../utils/auth";
import { useNavigate } from "react-router";

export default function AdminPage() {
	const navigate = useNavigate();
	const [authorized, setAuthorized] = useState(null); // Kiểm tra trạng thái quyền
	const [activeTab, setActiveTab] = useState("products");

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
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<span className="text-xl font-bold">
									Admin Dashboard
								</span>
							</div>
							<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
								<button
									onClick={() => setActiveTab("products")}
									className={`${
										activeTab === "products"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Products
								</button>
								<button
									onClick={() => setActiveTab("categories")}
									className={`${
										activeTab === "categories"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Categories
								</button>
								<button
									onClick={() => setActiveTab("order")}
									className={`${
										activeTab === "order"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Order
								</button>
								<button
									onClick={() => setActiveTab("customer")}
									className={`${
										activeTab === "customer"
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
									} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
								>
									Customer
								</button>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<main>
				{activeTab === "products" && <ProductManagement />}
				{activeTab === "categories" && <CategoryManagement />}
				{activeTab === "order" && <OrderManagement />}
				{activeTab === "customer" && <CustomerManagement />}
			</main>
		</div>
	);
}

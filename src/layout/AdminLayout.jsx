import { Outlet } from "react-router";
import Header from "../admin_components/Header";
import AdminPage from "../pages/admin/AdminPage";
import { useEffect, useState } from "react";

const AdminLayout = () => {
	const [activeTab, setActiveTab] = useState(
		() => localStorage.getItem("activeTab") || "products"
	);
	// Cập nhật localStorage mỗi khi activeTab thay đổi
	useEffect(() => {
		localStorage.setItem("activeTab", activeTab);
	}, [activeTab]);

	return (
		<div>
			<Header setActiveTab={setActiveTab} />
			<AdminPage activeTab={activeTab} setActiveTab={setActiveTab} />
			<Outlet />
		</div>
	);
};

export default AdminLayout;

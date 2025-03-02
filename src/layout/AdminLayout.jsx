import { Outlet } from "react-router";
import Header from "../admin_components/Header";
import AdminPage from "../pages/admin/AdminPage";
import { useState } from "react";

const AdminLayout = () => {
	const [activeTab, setActiveTab] = useState("products");
	return (
		<div>
			<Header setActiveTab={setActiveTab} />
			<AdminPage activeTab={activeTab} setActiveTab={setActiveTab} />
			<Outlet />
		</div>
	);
};

export default AdminLayout;

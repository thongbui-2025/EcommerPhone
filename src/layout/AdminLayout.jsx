import { Outlet } from "react-router";
import Header from "../admin_components/Header";
import AdminPage from "../pages/admin/AdminPage";

const AdminLayout = () => {
	return (
		<div>
			<Header />
			<AdminPage />
			<Outlet />
		</div>
	);
};

export default AdminLayout;

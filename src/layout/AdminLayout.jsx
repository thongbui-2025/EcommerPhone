import { Outlet } from "react-router";
import Header from "../admin_components/Header";

const AdminLayout = () => {
	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
};

export default AdminLayout;

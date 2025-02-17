import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
};
export default UserLayout;

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/user/HomePage.jsx";
import RegistrationForm from "./pages/user/RegistrationForm.jsx";
import LoginForm from "./pages/user/LoginForm.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import ProductDetails from "./components/ProductDetails";
import ShoppingCart from "./components/ShoppingCart";
import MediaPhoneList from "./components/MediaPhoneList";
import Profile from "./components/Profile";
import PurchaseHistory from "./components/PurchaseHistory";
import UserLayout from "./layout/UserLayOut.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import Payment from "./components/Payment/index.jsx";
import LoginPage from "./pages/admin/LoginPage.jsx";
import axios from "axios";
import SendMail from "./utils/sendMail.jsx";
import SearchPhone from "./components/SearchPhone/index.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement.jsx";
import CustomerManagement from "./pages/admin/CustomerManagement.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";

axios.defaults.baseURL = "https://localhost:7011/api/";

const router = createBrowserRouter([
	{
		element: <UserLayout />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "/product/:id",
				element: <ProductDetails />,
			},
			{
				path: "/:brand",
				element: <MediaPhoneList />,
			},
			{
				path: "/search/:keyword",
				element: <SearchPhone />,
			},
			{
				path: "/cart",
				element: <ShoppingCart />,
			},
			{
				path: "/cart/payment-info",
				element: <Payment />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/purchase-history",
				element: <PurchaseHistory />,
			},
			{
				path: "/confirm-email",
				element: <SendMail />,
			},
		],
	},
	{
		element: <AdminLayout />,
		children: [
			{
				path: "/admin",
				// element: <AdminPage />,
			},
			{
				path: "/productManagement",
				element: <ProductManagement />,
			},
			{
				path: "/categoryManagement",
				element: <CategoryManagement />,
			},
			{
				path: "/orderManagement",
				element: <OrderManagement />,
			},
			{
				path: "/customerManagement",
				element: <CustomerManagement />,
			},
		],
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: "/registration",
				element: <RegistrationForm />,
			},
			{
				path: "/login",
				element: <LoginForm />,
			},
			{
				path: "/login/admin",
				element: <LoginPage />,
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<RouterProvider router={router} />
	// </StrictMode>
);

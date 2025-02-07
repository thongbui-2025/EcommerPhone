import { StrictMode } from "react";
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
				path: "/iphone",
				element: <MediaPhoneList />,
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
		],
	},
	{
		element: <AdminLayout />,
		children: [{}],
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
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import axios from "axios";
import "./index.css";
import AuthLayout from "./layout/AuthLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import UserLayout from "./layout/UserLayout.jsx";
import HomePage from "./pages/user/HomePage.jsx";
import RegistrationForm from "./pages/user/RegistrationForm.jsx";
import LoginForm from "./pages/user/LoginForm.jsx";
import ResetPasswordForm from "./pages/user/ResetPasswordForm.jsx";
import ConfirmEmail from "./pages/user/ConfirmEmail.jsx";
import LoginPage from "./pages/admin/LoginPage.jsx";
import ProductManagement from "./pages/admin/ProductManagement.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement.jsx";
import CustomerManagement from "./pages/admin/CustomerManagement.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
import ProductDetails from "./components/ProductDetails";
import ShoppingCart from "./components/ShoppingCart";
import Profile from "./components/Profile";
import PurchaseHistory from "./components/PurchaseHistory";
import Payment from "./components/Payment/index.jsx";
import FavoritePhone from "./components/FavoritePhone/index.jsx";
import SendMail from "./utils/sendMail.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import RevenueReport from "./pages/admin/RevenueReport.jsx";
import AddressPage from "./components/Address/index.jsx";

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
				path: "/cart",
				element: <ShoppingCart />,
			},
			{
				path: "/cart/payment-info",
				element: <Payment />,
			},
			{
				path: "/payment-success",
				element: <PaymentSuccess />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/address",
				element: <AddressPage />,
			},
			{
				path: "/favorite",
				element: <FavoritePhone />,
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
				element: <ProductManagement />,
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
			{
				path: "/revenueReport",
				element: <RevenueReport />,
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
				path: "/confirm-email-register",
				element: <ConfirmEmail />,
			},
			{
				path: "/login",
				element: <LoginForm />,
			},
			{
				path: "/reset-password",
				element: <ResetPasswordForm />,
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

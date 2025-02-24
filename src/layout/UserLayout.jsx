import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRef, useState } from "react";

const UserLayout = () => {
	const [selectedBrand, setSelectedBrand] = useState("all");
	const productSectionRef = useRef(null);
	const productSearchRef = useRef(null);
	const [keyword, setKeyword] = useState(""); // State để lưu keyword
	const [keyChange, setKeyChange] = useState("");

	const handleBrandSelect = (brands) => {
		setSelectedBrand(brands);
		// Scroll đến danh mục sản phẩm khi chọn brand
		productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSearch = (keywords) => {
		setKeyword(keywords);
		productSearchRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header
				setSelectedBrand={handleBrandSelect}
				setKeyword={handleSearch}
				setKeyChange={setKeyChange}
				keyChange={keyChange}
			/>
			<Outlet
				context={{
					selectedBrand,
					productSectionRef,
					productSearchRef,
					keyword,
				}}
			/>
			<Footer />
		</div>
	);
};
export default UserLayout;

import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRef, useState } from "react";

const UserLayout = () => {
	const [selectedBrand, setSelectedBrand] = useState(0);
	const productSectionRef = useRef(null);
	const productSearchRef = useRef(null);
	const [keyword, setKeyword] = useState(""); // State để lưu keyword
	const [keyChange, setKeyChange] = useState("");

	const handleBrandSelect = (brandId, shouldScroll = true) => {
		setSelectedBrand(brandId);
		// Scroll đến danh mục sản phẩm khi chọn brand
		// Đợi state update xong mới scroll (đặc biệt với brandId === 0)
		setTimeout(() => {
			if (shouldScroll && brandId !== 0) {
				productSectionRef.current?.scrollIntoView({
					behavior: "smooth",
				});
			}

			// Nếu click "All" (brandId === 0) và muốn scroll:
			if (shouldScroll && brandId === 0) {
				productSectionRef.current?.scrollIntoView({
					behavior: "smooth",
				});
			}
		}, 100);
	};

	const handleSearch = (keywords) => {
		setKeyword(keywords);
		if (keywords !== "")
			productSearchRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSmooth = () => {
		productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="min-h-screen flex flex-col overflow-x-hidden">
			<Header
				setSelectedBrand={handleBrandSelect}
				setKeyword={handleSearch}
				setKeyChange={setKeyChange}
				keyChange={keyChange}
				keyword={keyword}
				productSearchRef={productSearchRef}
			/>
			<Outlet
				context={{
					selectedBrand,
					productSectionRef,
					productSearchRef,
					keyword,
					handleSmooth,
				}}
			/>
			<Footer className="w-full max-w-screen-xl mx-auto" />
		</div>
	);
};
export default UserLayout;

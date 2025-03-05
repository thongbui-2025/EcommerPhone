import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CreateCategory from "../../admin_components/CategoryManagement/CreateCategory";
import UpdateCategory from "../../admin_components/CategoryManagement/UpdateCategory";
import axios from "axios";

const ITEMS_PER_PAGE = 10;
const CategoryManagement = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [categoryToUpdate, setCategoryToUpdate] = useState(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const [categories, setCategories] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const displayedCategories = categories.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	useEffect(() => {
		axios
			.get("/Brands")
			.then((response) => setCategories(response.data))
			.catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
	}, []);

	const handleCreateCategory = (newCategory) => {
		console.log(newCategory);
		const token = localStorage.getItem("token");

		axios
			.post("/Brands", newCategory, {
				headers: { Authorization: `Bearer ${token}` }, // Thêm token vào header
			})
			.then((response) => {
				setCategories([...categories, response.data]);
				setShowCreateForm(false);
			})
			.catch((error) =>
				console.error("Lỗi khi tạo danh mục mới:", error)
			);
	};

	const handleCategoryUpdate = (updatedCategory) => {
		axios.put(`/Brands/${updatedCategory.id}`, updatedCategory).then(() => {
			setCategories((prevCategories) =>
				prevCategories.map((category) =>
					category.id === updatedCategory.id
						? { ...category, ...updatedCategory }
						: category
				)
			);
			setCategoryToUpdate(null);
		});
	};

	const handleConfirmDelete = () => {
		axios
			.delete(`/Brands/${categoryToDelete.id}`)
			.then(() => {
				setCategories((prevCategories) =>
					prevCategories.filter((c) => c.id !== categoryToDelete.id)
				);
				setShowDeleteConfirmation(false);
				setCategoryToDelete(null);
			})
			.catch((error) => {
				console.error("Lỗi khi xóa danh mục:", error);
			});
	};

	// const handleDeleteClick = (category) => {
	// 	setCategoryToDelete(category);
	// 	setShowDeleteConfirmation(true);
	// };

	const handleCancelDelete = () => {
		setShowDeleteConfirmation(false);
		setCategoryToDelete(null);
	};

	if (showCreateForm) {
		return (
			<CreateCategory
				onBack={() => setShowCreateForm(false)}
				onCreate={handleCreateCategory}
			/>
		);
	}

	if (categoryToUpdate) {
		return (
			<UpdateCategory
				category={categoryToUpdate}
				onBack={() => setCategoryToUpdate(null)}
				onUpdate={handleCategoryUpdate}
			/>
		);
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Main Content */}
			<div className="flex-1 p-8">
				<div className="bg-white rounded-lg shadow">
					{/* Breadcrumb */}
					<div className="bg-blue-400 text-white p-4 rounded-t-lg">
						Trang chủ / Danh mục
					</div>

					{/* Controls */}
					<div className="p-4 space-y-4">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => setShowCreateForm(true)}
								className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
							>
								Tạo mới
							</button>
						</div>

						{/* Categories Table */}
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-50">
										<th className="border p-3 text-left">
											STT
										</th>
										<th className="border p-3 text-left">
											Tên
										</th>
										<th className="border p-3 text-left">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{displayedCategories.map(
										(category, index) => (
											<tr
												key={category.id}
												className="hover:bg-gray-50"
											>
												<td className="border p-3">
													{startIndex + index + 1}
												</td>
												<td className="border p-3">
													{category.name}
												</td>
												<td className="border p-3">
													<div className="space-x-2">
														<button
															className="text-blue-500 hover:underline"
															onClick={() =>
																setCategoryToUpdate(
																	category
																)
															}
														>
															Cập nhật
														</button>
														{/* <span>|</span>
														<button
															className="text-red-500 hover:underline"
															onClick={() =>
																handleDeleteClick(
																	category
																)
															}
														>
															Xóa
														</button> */}
													</div>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-center space-x-2 mt-4">
							<button
								className="p-2 border rounded hover:bg-gray-100"
								onClick={() =>
									handlePageChange(currentPage - 1)
								}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="w-4 h-4" />
							</button>
							{[...Array(totalPages)].map((_, index) => (
								<button
									key={index}
									className={`p-2 border rounded ${
										currentPage === index + 1
											? "bg-blue-500 text-white"
											: "hover:bg-gray-100"
									}`}
									onClick={() => handlePageChange(index + 1)}
								>
									{index + 1}
								</button>
							))}
							<button
								className="p-2 border rounded hover:bg-gray-100"
								onClick={() =>
									handlePageChange(currentPage + 1)
								}
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirmation && (
				<div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">
							Xác nhận xóa danh mục
						</h2>
						<p className="mb-4">
							Bạn có chắc chắn muốn xóa danh mục{" "}
							{categoryToDelete?.name}?
						</p>
						<div className="flex justify-end space-x-2">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
								onClick={handleCancelDelete}
							>
								Hủy
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
								onClick={handleConfirmDelete}
							>
								Xóa
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoryManagement;

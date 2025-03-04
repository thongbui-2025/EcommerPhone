import { useState } from "react";
import axios from "axios";
import { Calendar, LineChart, Loader } from "lucide-react"; // Sử dụng lucide-react

const RevenueReport = () => {
	const [date, setDate] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [revenueData, setRevenueData] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchRevenue = async (url) => {
		try {
			setLoading(true);
			const response = await axios.get(`/Revenue/${url}`);
			setRevenueData(response.data);
		} catch (error) {
			console.error("Lỗi khi gọi API:", error);
			setRevenueData({ error: "Không thể lấy dữ liệu" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-8 mt-8 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
				<LineChart className="mr-2" /> Thống kê doanh thu
			</h2>

			<div className="flex flex-col md:flex-row gap-6">
				{/* Cột bên trái: Phần nhập liệu */}
				<div className="w-full md:w-1/2 space-y-4">
					{/* Thống kê theo ngày */}
					<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
						<label className="text-sm font-semibold mb-2 flex items-center">
							<Calendar className="mr-2" /> Chọn ngày:
						</label>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							onClick={() => fetchRevenue(`daily?date=${date}`)}
							className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600 transition duration-300"
						>
							Xem doanh thu ngày
						</button>
					</div>

					{/* Thống kê theo tháng */}
					<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
						<label className=" text-sm font-semibold mb-2 flex items-center">
							<Calendar className="mr-2" /> Chọn tháng:
						</label>
						<input
							type="month"
							value={month}
							onChange={(e) => setMonth(e.target.value)}
							className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							onClick={() =>
								fetchRevenue(
									`monthly?year=${
										month.split("-")[0]
									}&month=${month.split("-")[1]}`
								)
							}
							className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600 transition duration-300"
						>
							Xem doanh thu tháng
						</button>
					</div>

					{/* Thống kê theo năm */}
					<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
						<label className=" text-sm font-semibold mb-2 flex items-center">
							<Calendar className="mr-2" /> Nhập năm:
						</label>
						<input
							type="number"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							placeholder="Nhập năm (VD: 2023)"
							className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							onClick={() => fetchRevenue(`yearly?year=${year}`)}
							className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600 transition duration-300"
						>
							Xem doanh thu năm
						</button>
					</div>

					{/* Thống kê trong khoảng thời gian */}
					<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
						<label className=" text-sm font-semibold mb-2 flex items-center">
							<Calendar className="mr-2" /> Chọn khoảng thời gian:
						</label>
						<div className="flex gap-2">
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<button
							onClick={() =>
								fetchRevenue(
									`range?startDate=${startDate}&endDate=${endDate}`
								)
							}
							className="bg-blue-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-600 transition duration-300"
						>
							Xem doanh thu trong khoảng thời gian
						</button>
					</div>

					{/* Thống kê tổng doanh thu */}
					<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
						<button
							onClick={() => fetchRevenue(`all`)}
							className="bg-green-500 text-white px-4 py-2 w-full rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
						>
							<LineChart className="mr-2" /> Xem tổng doanh thu
						</button>
					</div>
				</div>

				{/* Cột bên phải: Hiển thị kết quả */}
				<div className="w-full md:w-1/2">
					{loading ? (
						<div className="flex justify-center items-center h-full">
							<Loader className="animate-spin text-blue-500" />
							<p className="ml-2 text-blue-500">Đang tải...</p>
						</div>
					) : revenueData ? (
						<div className="bg-gray-100 p-4 rounded-lg shadow-sm">
							<h3 className="font-bold text-lg mb-2">Kết quả:</h3>
							{revenueData.error ? (
								<p className="text-red-500">
									{revenueData.error}
								</p>
							) : (
								<ul className="list-disc pl-5">
									{Object.entries(revenueData).map(
										([key, value]) => (
											<li key={key} className="mb-1">
												<strong>{key}:</strong> {value}
											</li>
										)
									)}
								</ul>
							)}
						</div>
					) : (
						<div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center text-gray-500">
							<LineChart className="mx-auto mb-2" />
							<p>Chọn một tùy chọn để xem doanh thu</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RevenueReport;

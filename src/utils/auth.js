export const isAuthenticated = () => {
	return !!localStorage.getItem("token");
};

export const isAdmin = () => {
	const role = localStorage.getItem("role");

	// Kiểm tra role là admin thì mới cho phép
	return role === "admin";
};

export const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("role");
	window.location.href = "/login/admin"; // Chuyển hướng về trang đăng nhập
};

export const logoutUser = () => {
	// localStorage.removeItem("token");
	// localStorage.removeItem("role");
	localStorage.clear();
	window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
};

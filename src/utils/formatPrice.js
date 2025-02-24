export const formatPrice = (price) => {
	if (!price) {
		return 0 + "đ";
	}
	return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

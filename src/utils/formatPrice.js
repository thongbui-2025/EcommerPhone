export const formatPrice = (price) => {
	if (!price) {
		return null;
	}
	return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

export const lowestFinalPrice = (skus = []) => {
	if (!skus || skus.length === 0) return null; // Kiểm tra mảng rỗng
	return skus.reduce((min, sku) => {
		return sku?.finalPrice < min ? sku?.finalPrice : min;
	}, skus[0]?.finalPrice);
};
export const lowestDefaultPrice = (skus = []) => {
	if (!skus || skus.length === 0) return null; // Kiểm tra mảng rỗng
	return skus.reduce((min, sku) => {
		return sku?.defaultPrice < min ? sku?.defaultPrice : min;
	}, skus[0]?.defaultPrice);
};

export const discountPercentage = (skus = []) => {
	if (!skus || skus.length === 0) return null; // Kiểm tra mảng rỗng
	const lowestFinalPrice = skus.reduce((min, sku) => {
		return sku?.finalPrice < min ? sku?.finalPrice : min;
	}, skus[0]?.finalPrice);

	const lowestDiscount = skus.find(
		(sku) => sku.finalPrice === lowestFinalPrice
	)?.discountPercentage;

	return lowestDiscount;
};

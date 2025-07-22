export async function load() {
	// Generate synthetic payment data
	const payments = Array(10)
		.fill(0)
		.map((_, i) => ({
			id: `payment-${i}`,
			amount: Math.floor(Math.random() * 10000) / 100,
			status: ['pending', 'processing', 'success', 'failed'][Math.floor(Math.random() * 4)] as
				| 'failed'
				| 'pending'
				| 'processing'
				| 'success',
			email: `user${i}@example.com`
		}));

	return {
		payments
	};
}

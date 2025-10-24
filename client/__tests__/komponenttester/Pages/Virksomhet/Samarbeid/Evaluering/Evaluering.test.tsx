import '@testing-library/jest-dom';

describe('Evaluering', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Vi er i riktig univers', () => {
		expect(2 + 2).toBe(4);
	});
});
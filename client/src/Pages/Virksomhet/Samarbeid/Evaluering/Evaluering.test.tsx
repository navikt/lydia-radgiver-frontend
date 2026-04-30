
describe("Evaluering", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Vi er i riktig univers", () => {
        expect(2 + 2).toBe(4);
    });
});

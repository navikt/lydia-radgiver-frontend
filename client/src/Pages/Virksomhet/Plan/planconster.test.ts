import {
    defaultStartDate,
    defaultEndDate,
    FIRST_VALID_DATE,
    LAST_VALID_DATE,
} from "./planconster";

describe("planconster", () => {
    test("defaultStartDate er satt til dagens dato", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        expect(defaultStartDate.getFullYear()).toBe(today.getFullYear());
        expect(defaultStartDate.getMonth()).toBe(today.getMonth());
        expect(defaultStartDate.getDate()).toBe(today.getDate());
    });

    test("defaultEndDate er en måned etter defaultStartDate", () => {
        const expectedEnd = new Date(defaultStartDate);
        expectedEnd.setMonth(expectedEnd.getMonth() + 1);

        expect(defaultEndDate.getMonth()).toBe(expectedEnd.getMonth());
    });

    test("FIRST_VALID_DATE er 3 år før defaultStartDate", () => {
        const expected = new Date(defaultStartDate);
        expected.setFullYear(expected.getFullYear() - 3);

        expect(FIRST_VALID_DATE.getFullYear()).toBe(expected.getFullYear());
    });

    test("LAST_VALID_DATE er 3 år etter defaultEndDate", () => {
        const expected = new Date(defaultEndDate);
        expected.setFullYear(expected.getFullYear() + 3);

        expect(LAST_VALID_DATE.getFullYear()).toBe(expected.getFullYear());
    });
});

export const defaultStartDate = new Date();
defaultStartDate.setHours(0, 0, 0, 0);

export const defaultEndDate = new Date(defaultStartDate);
defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);

export const FIRST_VALID_DATE = new Date(defaultStartDate);
FIRST_VALID_DATE.setFullYear(FIRST_VALID_DATE.getFullYear() - 3);

export const LAST_VALID_DATE = new Date(defaultEndDate);
LAST_VALID_DATE.setFullYear(LAST_VALID_DATE.getFullYear() + 3);

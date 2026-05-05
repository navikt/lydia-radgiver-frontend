/* eslint-disable @typescript-eslint/ban-ts-comment */
import { toHaveNoViolations } from "jest-axe";
import { TextEncoder, TextDecoder } from "util";

expect.extend(toHaveNoViolations);
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

global.CSS = {
    // @ts-ignore
    supports: (k, v) => false,
};

const originalConsoleError = console.error;

console.error = (...args: unknown[]) => {
    const text = args.map((arg) => String(arg)).join("\n");

    const isActWarning = text.includes(
        "An update to %s inside a test was not wrapped in act(...).",
    );

    if (isActWarning) {
        return;
    }

    originalConsoleError(...(args as [unknown, ...unknown[]]));
};

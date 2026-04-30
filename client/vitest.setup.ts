import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

// axe-core prøver å bruke canvas for fargekontrast-sjekk – stub for å unngå støy
if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = () => null;
}

if (typeof globalThis.CSS === "undefined") {
    // @ts-expect-error – minimal stub
    globalThis.CSS = { supports: () => false };
}
if (typeof globalThis.CSS.supports !== "function") {
    globalThis.CSS.supports = () => false;
}

// Fallback for localStorage (Node 25 + jsdom-kollisjon kan etterlate broken Storage)
if (
    typeof window !== "undefined" &&
    typeof window.localStorage?.setItem !== "function"
) {
    const store = new Map<string, string>();
    const stub: Storage = {
        get length() {
            return store.size;
        },
        clear: () => store.clear(),
        getItem: (k) => store.get(k) ?? null,
        key: (i) => Array.from(store.keys())[i] ?? null,
        removeItem: (k) => void store.delete(k),
        setItem: (k, v) => void store.set(k, String(v)),
    };
    Object.defineProperty(window, "localStorage", {
        value: stub,
        configurable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
        value: stub,
        configurable: true,
    });
    Object.defineProperty(globalThis, "localStorage", {
        value: stub,
        configurable: true,
    });
}

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
    const text = args.map((arg) => String(arg)).join("\n");
    if (
        text.includes(
            "An update to %s inside a test was not wrapped in act(...).",
        )
    ) {
        return;
    }
    originalConsoleError(...(args as [unknown, ...unknown[]]));
};

const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
    const text = args.map((arg) => String(arg)).join("\n");
    // Umami er ikke tilgjengelig i testmiljø – forventet
    if (text.includes("Umami er ikke tilgjengelig")) {
        return;
    }
    originalConsoleWarn(...(args as [unknown, ...unknown[]]));
};

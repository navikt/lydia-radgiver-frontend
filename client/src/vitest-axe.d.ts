// Augmenterer vitest sin Assertion-type med vitest-axe sine matchere.
// vitest-axe@0.1.0 deklarerer matchere på `namespace Vi`, mens vitest 3+
// flyttet dem til `@vitest/expect`.
import "vitest";

declare module "vitest" {
    interface Assertion {
        toHaveNoViolations(): void;
    }
    interface AsymmetricMatchersContaining {
        toHaveNoViolations(): void;
    }
}

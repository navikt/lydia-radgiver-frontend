/* eslint-disable @typescript-eslint/ban-ts-comment */
import { toHaveNoViolations } from "jest-axe";
import { TextEncoder, TextDecoder } from "util";

expect.extend(toHaveNoViolations);
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

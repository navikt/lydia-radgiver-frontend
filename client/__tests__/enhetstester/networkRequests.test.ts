import { TextEncoder, TextDecoder } from "util";
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextEncoder = TextEncoder;
// @ts-expect-error dette må gjøres for å få testene til å kjøre, da disse ikke er definert i jsdom
global.TextDecoder = TextDecoder;

import { z } from "zod/v4";
import {
	defaultSwrConfiguration,
	post,
	put,
	httpDelete,
} from "../../src/api/lydia-api/networkRequests";

// Mock dispatchFeilmelding
jest.mock("../../src/components/Banner/dispatchFeilmelding", () => ({
	dispatchFeilmelding: jest.fn(),
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("defaultSwrConfiguration", () => {
	test("har revalidateOnFocus satt til false", () => {
		expect(defaultSwrConfiguration.revalidateOnFocus).toBe(false);
	});

	test("har revalidateOnReconnect satt til false", () => {
		expect(defaultSwrConfiguration.revalidateOnReconnect).toBe(false);
	});
});

describe("post", () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	test("sender POST-request med CSRF-token og body", async () => {
		const csrfToken = "test-csrf-token";
		const responseData = { id: 1, name: "Test" };
		const schema = z.object({ id: z.number(), name: z.string() });

		// First call: CSRF token fetch
		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		// Second call: actual POST request
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		const result = await post("/api/test", schema, { data: "test" });

		expect(mockFetch).toHaveBeenCalledTimes(2);

		// Verify CSRF fetch
		expect(mockFetch).toHaveBeenNthCalledWith(1, "/csrf-token", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		// Verify POST request
		expect(mockFetch).toHaveBeenNthCalledWith(2, "/api/test", {
			method: "POST",
			body: JSON.stringify({ data: "test" }),
			headers: {
				"Content-Type": "application/json",
				"x-csrf-token": csrfToken,
			},
		});

		expect(result).toEqual(responseData);
	});

	test("sender POST-request uten body når body er undefined", async () => {
		const csrfToken = "test-csrf-token";
		const responseData = { success: true };
		const schema = z.object({ success: z.boolean() });

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		await post("/api/test", schema);

		expect(mockFetch).toHaveBeenNthCalledWith(2, "/api/test", {
			method: "POST",
			body: undefined,
			headers: {
				"Content-Type": "application/json",
				"x-csrf-token": csrfToken,
			},
		});
	});

	test("returnerer rejected promise ved Zod-valideringsfeil", async () => {
		const csrfToken = "test-csrf-token";
		const invalidResponseData = { id: "not-a-number", name: "Test" };
		const schema = z.object({ id: z.number(), name: z.string() });

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(invalidResponseData),
		});

		await expect(post("/api/test", schema)).rejects.toBeInstanceOf(z.ZodError);
	});

	test("håndterer 404-feil med ZodError på undefined data", async () => {
		const csrfToken = "test-csrf-token";
		const schema = z.object({ id: z.number() });

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			text: () => Promise.resolve("Not found"),
		});

		// Feilhåndteringen fører til at data blir undefined, som feiler Zod-validering
		await expect(post("/api/test", schema)).rejects.toBeInstanceOf(z.ZodError);
	});
});

describe("put", () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	test("sender PUT-request med CSRF-token og body", async () => {
		const csrfToken = "test-csrf-token";
		const responseData = { id: 1, updated: true };
		const schema = z.object({ id: z.number(), updated: z.boolean() });

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		const result = await put("/api/test/1", schema, { name: "Updated" });

		expect(mockFetch).toHaveBeenCalledTimes(2);

		expect(mockFetch).toHaveBeenNthCalledWith(2, "/api/test/1", {
			method: "PUT",
			body: JSON.stringify({ name: "Updated" }),
			headers: {
				"Content-Type": "application/json",
				"x-csrf-token": csrfToken,
			},
		});

		expect(result).toEqual(responseData);
	});
});

describe("httpDelete", () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	test("sender DELETE-request med CSRF-token", async () => {
		const csrfToken = "test-csrf-token";
		const responseData = { deleted: true };
		const schema = z.object({ deleted: z.boolean() });

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		const result = await httpDelete("/api/test/1", schema);

		expect(mockFetch).toHaveBeenCalledTimes(2);

		expect(mockFetch).toHaveBeenNthCalledWith(2, "/api/test/1", {
			method: "DELETE",
			body: undefined,
			headers: {
				"Content-Type": "application/json",
				"x-csrf-token": csrfToken,
			},
		});

		expect(result).toEqual(responseData);
	});
});

describe("schema-validering", () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	test("validerer komplekse nested objekter", async () => {
		const csrfToken = "test-csrf-token";
		const schema = z.object({
			user: z.object({
				id: z.number(),
				name: z.string(),
				roles: z.array(z.string()),
			}),
			metadata: z.object({
				createdAt: z.string(),
			}),
		});

		const responseData = {
			user: {
				id: 1,
				name: "Test User",
				roles: ["admin", "user"],
			},
			metadata: {
				createdAt: "2025-01-01",
			},
		};

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		const result = await post("/api/users", schema, {});

		expect(result).toEqual(responseData);
	});

	test("feiler ved manglende påkrevde felter", async () => {
		const csrfToken = "test-csrf-token";
		const schema = z.object({
			id: z.number(),
			requiredField: z.string(),
		});

		const responseData = {
			id: 1,
			// requiredField is missing
		};

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		await expect(post("/api/test", schema)).rejects.toBeInstanceOf(z.ZodError);
	});

	test("håndterer optional felter korrekt", async () => {
		const csrfToken = "test-csrf-token";
		const schema = z.object({
			id: z.number(),
			optionalField: z.string().optional(),
		});

		const responseData = {
			id: 1,
		};

		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve({ csrfToken }),
		});

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(responseData),
		});

		const result = await post("/api/test", schema);

		expect(result).toEqual(responseData);
		expect(result.optionalField).toBeUndefined();
	});
});

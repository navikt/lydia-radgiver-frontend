import {
	formaterSomHeltall,
	formaterSomProsentMedEnDesimal,
} from "../../src/util/tallFormatering";

describe("tallFormatering", () => {
	test("formaterSomHeltall runder til nærmeste heltall uten desimaler", () => {
		expect(formaterSomHeltall(10.7)).toBe("11");
		expect(formaterSomHeltall(999.4)).toBe("999");
	});

	test("formaterSomProsentMedEnDesimal gir én desimal og prosent-tegn", () => {
		const resultat = formaterSomProsentMedEnDesimal(12.34);

		expect(resultat).toBe("12,3 %");
	});
});

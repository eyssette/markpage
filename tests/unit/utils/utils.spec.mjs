import { decodeString, levenshteinDistance } from "../../../app/js/utils.js";

describe("decodeString", () => {
	it("decodes a base64 encoded string", () => {
		const encoded = btoa("Hello, World!");
		const decoded = decodeString(encoded);
		expect(decoded).toBe("Hello, World!");
	});

	it("decodes a base64 encoded string with special characters", () => {
		const encoded = btoa("Café & Crème");
		const decoded = decodeString(encoded);
		expect(decoded).toBe("Café & Crème");
	});
});

describe("levenshteinDistance", function () {
	it("returns 0 when comparing two identical strings", function () {
		const result = levenshteinDistance("kitten", "kitten");
		expect(result).toEqual(0);
	});

	it("returns the length of the second string when the first is empty", function () {
		const result = levenshteinDistance("", "test");
		expect(result).toEqual(4);
	});

	it("returns the length of the first string when the second is empty", function () {
		const result = levenshteinDistance("test", "");
		expect(result).toEqual(4);
	});

	it("calculates the distance when one substitution is required", function () {
		const result = levenshteinDistance("kitten", "sitten");
		expect(result).toEqual(1);
	});

	it("calculates the distance when one insertion is required", function () {
		const result = levenshteinDistance("kitten", "kittlen");
		expect(result).toEqual(1);
	});

	it("calculates the distance when one deletion is required", function () {
		const result = levenshteinDistance("kitten", "kiten");
		expect(result).toEqual(1);
	});

	it("computes the correct distance with multiple edits", function () {
		const result = levenshteinDistance("kitten", "sitting");
		expect(result).toEqual(3);
	});

	it("handles completely different strings", function () {
		const result = levenshteinDistance("abc", "xyz");
		expect(result).toEqual(3);
	});

	it("returns 0 when comparing two empty strings", function () {
		const result = levenshteinDistance("", "");
		expect(result).toEqual(0);
	});

	it("treats case-sensitive differences as edits", function () {
		const result = levenshteinDistance("Apple", "apple");
		expect(result).toEqual(1);
	});

	it("calculates the distance for longer strings with multiple edits", function () {
		const result = levenshteinDistance(
			"kitten is a small domesticated carnivorous mammal",
			"sitting is a common position for humans",
		);
		expect(result).toEqual(30);
	});
});

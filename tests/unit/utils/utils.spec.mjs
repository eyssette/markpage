import { decodeString } from "../../../app/js/utils.js";

/* export function decodeString(str) {
	return decodeURIComponent(window.atob(str));
} */

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

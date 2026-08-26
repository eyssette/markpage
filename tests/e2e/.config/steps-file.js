// in this file you can append custom step methods to 'I' object

import { actor } from "codeceptjs";

const customMethods = () =>
	actor({
		// Define custom steps here, use 'this' to access default methods of I.
	});

export default customMethods;

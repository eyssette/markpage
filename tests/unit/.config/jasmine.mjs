const config = {
	spec_dir: "tests/unit",
	spec_files: ["**/*[sS]pec.?(m)js"],
	helpers: ["helpers/**/*.?(m)js"],
	env: {
		stopSpecOnExpectationFailure: false,
		random: true,
		forbidDuplicateNames: true,
	},
};

export default config;

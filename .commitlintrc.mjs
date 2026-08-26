const config = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		// Ajout de "edit" et "bump", en plus des types standards
		// déjà couverts par @commitlint/config-conventional
		"type-enum": [
			2,
			"always",
			[
				"build",
				"chore",
				"ci",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"style",
				"test",
				"edit",
				"bump",
			],
		],
		"header-max-length": [0],
		"body-max-length": [0],
		"body-max-line-length": [0],
		"subject-max-length": [0],
		"footer-max-length": [0],
		"scope-required-for-feat-fix": [2, "always"],
	},
	plugins: [
		{
			rules: {
				"scope-required-for-feat-fix": (parsed) => {
					const { type, scope } = parsed;
					if ((type === "feat" || type === "fix") && !scope) {
						return [
							false,
							"Le scope est obligatoire pour les commits de type feat et fix (ex: fix(auth): ...)",
						];
					}
					return [true];
				},
			},
		},
	],
};

export default config;

const config = {
	extends: ["stylelint-config-standard"],
	rules: {
		// On utilise une convention de nommage camelCase pour les classes, les IDs et les variables CSS personnalisées
		"selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
		"selector-id-pattern": "^[a-z][a-zA-Z0-9]+$",
		"custom-property-pattern": "^[a-z][a-zA-Z0-9]+$",
	},
};

export default config;

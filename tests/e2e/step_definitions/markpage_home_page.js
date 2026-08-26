const { I } = inject();

Given("Je lance la page d'accueil", () => {
	I.amOnPage("/");
});

Then("Je vois le texte Markpage", () => {
	I.see("Markpage");
});

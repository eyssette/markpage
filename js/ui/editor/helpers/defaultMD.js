export function getDefaultMD() {
	const isLightpad =
		window.location.href.includes("https://lightpad.forge.apps.education.fr") ||
		window.location.href.includes("?lightpad");
	return isLightpad ? defaultMDLightpad : defaultMDMarkpage;
}

const defaultMDMarkpage = `# Titre

Message initial

## Partie 1

### Sous-partie 1
Contenu

### Sous-partie 2
Contenu

## Partie 2

### Sous-partie 1
Contenu

### Sous-partie 2
Contenu

`;

const defaultMDLightpad = `---
theme: base
---

# Titre du site

## Colonne 1

### Capsule 1

Contenu de la capsule 1

### Capsule 2

Contenu de la capsule 2


## Colonne 2

### Capsule 3

- élément de liste
- élément de liste
- élément de liste

### Capsule 4

#### Sous-titre

Contenu de sous-partie

#### Sous-titre

Contenu de sous-partie

## Colonne sans capsule

Contenu de colonne sans capsule

#### Sous-titre

Contenu de sous-partie

#### Sous-titre

Contenu de sous-partie
`;

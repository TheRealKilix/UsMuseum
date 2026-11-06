export const NAME = "Mon amour";

export const INTRO =
  "Bienvenue dans le musée qui n’existe que pour toi.\nChaque tableau cache un petit mot.";

export const EXHIBITS = [
  {
    title: "Le bouquet de lys",
    message:
      "Chaque jour avec toi est un petit cadeau.\nMerci d’être là, tout simplement.",
  },
  {
    title: "Là-haut, avec toi",
    message: "Même tout là-haut, c’est toi la plus belle vue.",
  },
  {
    title: "Le trajet câlin",
    message: "Peu importe la route, tant que je suis à côté de toi.",
  },
  {
    title: "Petit matin",
    message: "Tes sourires du matin sont mes préférés.",
  },
  {
    title: "Tête contre tête",
    message: "Ma place préférée au monde : tout contre toi.",
  },
  {
    title: "Les yeux dans les nuages",
    message: "Avec toi, même les nuages ont l’air de danser.",
  },
  {
    title: "Soleil sur nous",
    message: "Tu fais briller tout ce que tu touches, même les jours gris.",
  },
  {
    title: "La sieste sous l’arbre",
    message: "Mon endroit préféré : sur une serviette, à l’ombre, avec toi.",
  },
  {
    title: "Têtes posées",
    message: "Je pourrais rester là des heures, ta tête contre la mienne.",
  },
  {
    title: "Pique-nique entre amoureux",
    message: "Pizza, herbe et soleil. Le plan parfait avec toi.",
  },
  {
    title: "Main dans la main",
    message: "Deux bracelets, deux poignets, une seule équipe.",
  },
  {
    title: "Un bisou volé",
    message: "Je ne me lasserai jamais de te faire sourire comme ça.",
  },
  {
    title: "Tout contre toi",
    message: "Le plus beau, c’est toi, juste là.",
  },
  {
    title: "Mon petit soldat 🫡",
    message:
      "Casquette sur la tête, pouce en l’air : tu me fais toujours rire.",
  },
];

export const FINAL_MESSAGE = {
  title: "Joyeux anniversaire 🎂",
  message:
    "Joyeux anniversaire mon amour !\nJe t’aime plus que tout. Ce musée est à toi, pour toujours. ❤️",
};

export const ARTWORKS = Array.from(
  { length: EXHIBITS.length },
  (_, index) =>
    new URL(
      `./assets/artworks/artwork-${String(index + 1).padStart(2, "0")}.jpg`,
      import.meta.url,
    ).href,
);

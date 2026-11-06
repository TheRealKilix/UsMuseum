# Notre Musée 3D

Un musée d’anniversaire en 3D, pensé pour le téléphone : photos à découvrir,
petits mots, cœurs à attraper et mini-jeu. La musique en boucle et les effets
sonores sont générés ou joués localement ; les photos ne sont envoyées vers
aucun service.

## Lancer le musée en local

Prérequis : Node.js 18 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrez l’adresse locale affichée par Vite. Pour tester la version de production :

```bash
npm run build
npm run preview
```

Le dossier `dist/` généré par `npm run build` est le site prêt à publier.

## Déployer

Publiez le contenu de `dist/` sur un hébergeur de sites statiques, par exemple
GitHub Pages, Netlify ou Cloudflare Pages. La configuration Vite utilise des
chemins relatifs pour fonctionner également lorsque le site est servi depuis
un sous-chemin.

## Personnaliser

- Modifiez le prénom, le texte d’introduction, les 14 titres et messages dans
  `src/content.js`.
- Remplacez les images `src/assets/artworks/artwork-01.jpg` à
  `artwork-14.jpg`. Gardez les noms de fichiers afin que l’ordre des photos
  corresponde aux textes. Les images doivent être au format JPEG.
- Remplacez `src/assets/music/theme.mp3` pour changer la musique de fond en
  boucle.
- Ajustez la présentation et les commandes mobiles dans `src/styles.css`.

Les contrôles tactiles sont affichés à l’écran ; sur ordinateur, utilisez les
touches fléchées ou WASD pour vous déplacer, espace pour sauter et glissez dans
la scène pour regarder autour de vous.

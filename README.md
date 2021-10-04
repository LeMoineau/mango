# mango

Application ionic pour lire, télécharger et (un peu) organiser les derniers scans de manga sortis.

Cette application se repose quasis exclusivement sur le web scraping de plusieurs sites qui sont cités dans les crédits. Si vous lisez ce README depuis un ordi, ça sert vraiment à pas grand-chose de télécharger le projet puisque vous pouvez faire presque pareil en ouvrant un nouvel onglet ;)

## Requirements

- ionic
- android studio (pour émuler sur android)

## Lancer mango sur navigateur

c'est artisanal mais pour le moment c'est comme ça ':]

- Changez la valeur de "inProduction" à `false` dans le fichier `src/app/services/proxy.service.ts`
- lancez un terminal powerShell dans le dossier `/mango`
- puis tapez `ionic serve`

## Lancer mango sur un émulateur android ou (pas) ios

Pour lancer l'application sur un émulateur android ou ios, vous aurez besoin respectivement de android studio ou de 20000 trucs et beaucoup d'argent ;D

- Changez la valeur de "inProduction" à `true` dans le fichier `src/app/services/proxy.service.ts` (toujours ghetto)
- lancez un terminal powerShell dans le dossier `/mango`

Si c'est la première fois, tapez les commandes suivantes:
- `ionic build`
- `ionic cap add <android|ios>`
- `ionic cap copy`

Pour toutes les fois:
- `ionic cap sync`
- `ionic cap open <android|ios>`

__source__: https://ionicframework.com/docs/angular/your-first-app/6-deploying-mobile

## Crédits (web scraping)

- https://scantrad.net/
- https://www.scan-vf.net/
- https://www.scan-vf.cc/

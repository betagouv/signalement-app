# SignalementApp

Application frontend de l'outil signalement.

L’outil signalement permet à chaque consommateur de signaler directement les anomalies constatées dans sa vie de tous les jours (chez son épicier, dans un bar..), de manière très rapide et très simple auprès du professionnel.

Plus d'information ici : https://beta.gouv.fr/startup/signalement.html

## Développement

Installation des dépendences :
```bash
npm install
```

Lancement de l'application en local :
```bash
npm run start:local
```

L'application est accessible à l'adresse `http://localhost:4200` avec rechargement à chaud des modifications.

## Tests unitaires

Pour exécuter les tests unitaires via [Karma](https://karma-runner.github.io) :

```bash
npm test
```

## Démo

La version de démo de l'application est accessible à l'adresse https://signalement-app.herokuapp.com/

## Production

L'application de production de l'application  est accessible à l'adresse https://signal.conso.gouv.fr

## API

L'application s'appuie sur les API suivantes :
* Signalement : https://github.com/betagouv/signalement-api
* Entreprise : https://github.com/etalab/sirene_as_api
* Adresse : https://adresse.data.gouv.fr/api

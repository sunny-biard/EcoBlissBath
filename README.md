# Installation du projet

- Téléchargez ou clonez le dépôt avec la commande :
```
$ git clone https://github.com/sunny-biard/EcoBlissBath.git
```
- Téléchargez puis installez [Docker](https://www.docker.com)
- Depuis un terminal ouvert dans le dossier du projet, lancez la commande :
```
$ docker-compose up --build
```

- Ouvrez le site depuis la page : http://localhost:8080.

# Cypress

- Téléchargez puis installez [Node.js](https://nodejs.org/en/download/package-manager/current)
- Depuis un terminal ouvert dans le dossier du projet, lancez la commande :

```bash
$ npx cypress run
```
- Si vous souhaitez lancer les tests sur un navigateur en particulier, lancez la commande (en remplaçant <navigateur> par le navigateur de votre choix parmi Firefox, Chrome, Edge, Electron) :

```bash
$ npx cypress run --browser <navigateur>
```

# Rapports de test

- A la suite de l'exécution des tests , les rapports seront disponibles dans le dossier _mochawesome-report_ aux formats HTML et JSON.

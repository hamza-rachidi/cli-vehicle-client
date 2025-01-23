# 🚗 Vehicle CLI: Gérer vos véhicules
---

Bienvenue dans **Vehicle CLI**, un outil de ligne de commande 🛠️ conçu pour interagir avec votre serveur 🚀. Avec cet outil, vous pouvez créer, lister et supprimer des véhicules de manière simple et efficace.

## 📋 Fonctionnalités
### Avec **Vehicle CLI**, vous pouvez :
- **Créer un véhicule** : Ajoutez un véhicule en spécifiant un shortcode, le niveau de batterie et ses coordonnées géographiques.
- **Lister les véhicules** : Obtenez un tableau des véhicules disponibles sur le serveur.
- **Supprimer un véhicule** : Retirez un véhicule du serveur à l’aide de son ID.

## 🛠️ Installation et mise en place


### 1️⃣ Cloner le projet
```bash
git clone https://github.com/hamza-rachidi/cli-vehicle-client.git
cd cli-vehicle-client
```

L'application est disponible sous forme d'image Docker prête à être utilisée. Voici comment y procéder.

### 2️⃣ Construire l'image Docker
Pour créer une image Docker à partir du `Dockerfile` :
```bash
docker build -t vehicle-cli .
```

### 3️ Vérifier l'image Docker
Une fois l'image construite, vérifiez qu'elle est bien disponible localement :
```bash
docker images
```
Cela affichera la liste des images disponibles, y compris celle nommée `vehicle-cli`.

### 3️⃣ Exécuter un conteneur
Pour tester l'application CLI :

```bash
docker run --rm --network=host vehicle-cli --help
```
- **`--rm`** : Supprime automatiquement le conteneur après l'exécution.
- **`--network=host`** : Permet au conteneur d'utiliser le réseau de l'hôte pour accéder au serveur que vous êtes lancer sur l'adresse souhaitée ( l'application prend en charge cela ).

### 4️⃣ 📖 Utilisation
Voici comment exécuter les commandes principales :
- #### **Créer un véhicule**
Ajoutez un véhicule avec les options nécessaires :
  ```bash
 docker run --rm --network=host vehicle-cli --address http://localhost:8080 create-vehicle --shortcode=abcd --battery=50 --longitude=12.34 --latitude=56.78
  ```
 ou plus birèvement
  ```bash
 docker run --rm --network=host vehicle-cli -a http://localhost:8080 create-vehicle -c abcd -b 50 -l 12.34 -L 56.78
  ```
 Une fois créé avec succès, vous verrez ce message en l'occurence :
```
Created vehicle 'abcd', with ID '1'
```

- **Lister les véhicules** :
  ```bash
  docker run --rm --network=host vehicle-cli -a http://localhost:8080 list-vehicles
  ```
Ce qui produira un tableau comme ceci (si vous avez créé deux véhicules par exemple) :
```
List of Vehicles:
┌─────────┬─────┬───────────┬──────────┬───────────┬───────────┐
│ (index) │ ID  │ Shortcode │ Battery  │ Longitude │ Latitude  │
├─────────┼─────┼───────────┼──────────┼───────────┼───────────┤
│    0    │  1  │   abcd    │   80%    │   12.34   │   56.78   │
│    1    │  2  │   efgh    │   60%    │   23.45   │   67.89   │
└─────────┴─────┴───────────┴──────────┴───────────┴───────────┘
```
- **Supprimer un véhicule** :
  ```bash
  docker run --rm --network=host vehicle-cli -a http://localhost:8080 delete-vehicle -i 1
  ```
Une fois supprimé avec succès, vous verrez ce message :
```
Vehicle with ID '1' was successfully deleted.
```

💡 **Astuce** : Assurez-vous que votre serveur est démarré et accessible à l'adresse fournie avec `-a`.

---
### Afficher l'aide générale
Si vous voulez consulter un guide pour comprendre les arguments qu'il faut passer et les fonctionnalités davantage :
 ```bash
 docker run --rm --network=host vehicle-cli --help
```

## 🚀 Livraison continue

Un workflow GitHub Actions est configuré pour :
1. Construire l'image Docker.
2. Publier l'image sur Docker Hub lors de la création d'un tag Git (par exemple, `v1.2.0`).

L'image Docker est publiée sur Docker Hub et prête à l'emploi.


## 💡 Conseils
- Si une commande échoue :
  - Vérifiez que votre serveur est actif et accessible à l'adresse spécifiée avec `--address`.
  - Lisez attentivement les messages d'erreur pour ajuster vos options.
- Utilisez `--help` pour chaque commande pour consulter ses options et son usage.
---


🎉 Merci d'utiliser **Vehicle CLI** ! Si vous avez des questions ou des suggestions, ouvrez un ticket dans le dépôt GitHub.

---

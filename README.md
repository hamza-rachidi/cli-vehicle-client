# Dockerisation de l'Application Vehicle CLI 🚀

Ce projet contient un fichier **Dockerfile** et un fichier de workflow pour **la livraison continue (CD)** de  l'application développée. L'application est prête à être publiée sous forme d'image Docker et déployée sur un registre Docker tel que Docker Hub. Cependant, le mappage des ports hôte-conteneur présente encore un problème à résoudre. 🛠️

---

## Étapes pour utiliser Docker avec Vehicle CLI 🐳

### 1. **Construire l'image Docker**
Pour créer une image Docker à partir du `Dockerfile` présent dans le projet, utilisez la commande suivante :
```bash
docker build -t vehicle-cli .
```
- **`-t vehicle-cli`** : Attribue un nom à l'image (`vehicle-cli`).
- **`.`** : Indique que le fichier `Dockerfile` est dans le répertoire courant.

### 2. **Vérifier l'image Docker**
Une fois l'image construite, vérifiez qu'elle est bien disponible localement :
```bash
docker images
```
Cela affichera la liste des images disponibles, y compris celle nommée `vehicle-cli`.

### 3. **Exécuter un conteneur à partir de l'image**
Pour tester l'application CLI, exécutez un conteneur Docker basé sur l'image :
```bash
docker run --rm vehicle-cli --help
```
- **`--rm`** : Supprime automatiquement le conteneur après l'exécution.
- **`vehicle-cli --help`** : Affiche les options disponibles de votre CLI.

### 4. **Exécuter en mappant des ports**
Des problèmes de port hôte persistent actuellement. Même si le serveur écoute par exemple sur un port, le docker isolé n'arrive pas à fetcher le serveur. 

---

## Déploiement Continu avec Docker Hub 🚀

Un workflow GitHub Actions est déjà configuré pour :
1. Construire l'image Docker.
2. Publier l'image sur Docker Hub lorsque vous poussez un tag (par exemple `v1.0.0`).

Pour que cela fonctionne :
- Configurez vos **secrets GitHub** avec vos identifiants Docker Hub :
  - **`DOCKER_USERNAME`** : Votre nom d'utilisateur Docker Hub.
  - **`DOCKER_PASSWORD`** : Votre mot de passe Docker Hub.
- Le workflow associera le **tag Git** au **tag Docker**.


N'hésitez pas à poser vos questions ou à contribuer pour résoudre ces problèmes ! 😊

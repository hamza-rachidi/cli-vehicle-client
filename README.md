# 🚗 Vehicle CLI: Ajouter un véhicule

Bienvenue dans **Vehicle CLI**, un outil de ligne de commande 🛠️ conçu pour interagir avec votre serveur 🚀. Cette fonctionnalité vous permet de créer des véhicules via la commande `create-vehicle`.

## 📋 À quoi sert cette fonctionnalité ?
Avec `create-vehicle`, vous pouvez :
- Ajouter un véhicule avec un **shortcode**, un niveau de batterie, et des coordonnées géographiques.
- Interagir facilement avec votre serveur sans devoir écrire des requêtes HTTP manuellement.
- Obtenir des retours clairs sur les erreurs et réussites depuis le serveur.

---

## 🛠️ Installation et mise en place

Suivez ces étapes simples pour installer et exécuter le projet.

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/hamza-rachidi/cli-vehicle-client.git
cd cli-vehicle-client
```

### 2️⃣ Installer les dépendances
Assurez-vous d'avoir Node.js (v20 ou supérieur) installé, puis exécutez :
```bash 
npm run ci
```

### 3️⃣ Compiler le projet
Transpilez le code TypeScript en JavaScript avec :
```bash 
npm run build
```

### 4️⃣ Installer globalement
Installez la CLI pour l'utiliser comme une commande globale :
```bash 
npm run global-install
```

## 📖 Utilisation

1️⃣ Afficher l'aide générale
Vous pouvez consulter l'aide pour comprendre les options disponibles :

```bash 
vehicle-cli --help
```
2️⃣ Afficher l'aide pour create-vehicle
Pour voir les options spécifiques à la commande create-vehicle :

```bash 
vehicle-cli create-vehicle --help
```

3️⃣ Créer un véhicule
Voici un exemple de commande pour créer un véhicule avec les options requises :
```bash 
vehicle-cli --address http://localhost:8080 create-vehicle --shortcode=abcd --battery=50 --longitude=12.34 --latitude=56.78
```
ou plus brièvement 

```bash 
vehicle-cli -a http://localhost:8080 create-vehicle -c abcd -b 50 -l 12.34 -L 56.78
```

- -a, --address <server adress> : Spécifiez l'adresse du serveur :  le host et le port (par exemple, http://localhost:8080).
- -c, ou --shortcode <string> : Le shortcode du véhicule (4 caractères).
- -b ou --battery <integer> : Le niveau de batterie (entre 0 et 100).
- -l ou --longitude <number> : La longitude du véhicule (entre -90 and 90).
- -L ou --latitude <number> : La latitude du véhicule (entre -90 and 90).

💡 Conseils
Si une commande échoue, vérifiez que votre serveur est actif et accessible à l'adresse fournie avec --address.
Utilisez --help pour chaque commande ou sous-commande pour voir les options disponibles.

Si le message d'erreur mentionne des détails comme "Shortcode must be only 4 characters long", corrigez vos options en conséquence. 

Voici un exemple d'une mauvaise requête :
```bash 
vehicle-cli --address http://localhost:8080 create-vehicle --shortcode abcdef --battery 50 --longitude 12.34 --latitude 56.78
```

🚀 fonctionnalités : 
- ✅ Ajouter un véhicule (terminé)
- 🛠️ Lister les véhicules (en cours)
- ❌ Supprimer un véhicule (à venir)

🎉 Merci d'utiliser Vehicle CLI ! Si vous avez des questions ou des suggestions, ouvrez un ticket dans le dépôt GitHub.

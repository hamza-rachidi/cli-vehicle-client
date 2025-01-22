# 🚗 Vehicle CLI: Gérer vos véhicules

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

### 1️⃣ Afficher l'aide générale
Consultez l'aide pour comprendre les options disponibles :
```bash 
vehicle-cli --help
```

### 2️⃣ Commandes disponibles
#### **Créer un véhicule**
Ajoutez un véhicule avec les options nécessaires :
```bash 
vehicle-cli --address http://localhost:8080 create-vehicle --shortcode=abcd --battery=50 --longitude=12.34 --latitude=56.78
```
Ou, plus brièvement :
```bash 
vehicle-cli -a http://localhost:8080 create-vehicle -c abcd -b 50 -l 12.34 -L 56.78
```

- -a, --address <server adress> : Spécifiez l'adresse du serveur :  le host et le port (par exemple, http://localhost:8080).
- -c, ou --shortcode <string> : Le shortcode du véhicule (4 caractères).
- -b ou --battery <integer> : Le niveau de batterie (entre 0 et 100).
- -l ou --longitude <number> : La longitude du véhicule (entre -90 and 90).
- -L ou --latitude <number> : La latitude du véhicule (entre -90 and 90).

#### **Lister les véhicules**
Affichez tous les véhicules disponibles sur le serveur :
```bash
vehicle-cli --address http://localhost:8080 list-vehicles
```
Ce qui produira un tableau comme ceci (si des véhicules existent) :
```
List of Vehicles:
┌─────────┬─────┬───────────┬──────────┬───────────┬───────────┐
│ (index) │ ID  │ Shortcode │ Battery  │ Longitude │ Latitude  │
├─────────┼─────┼───────────┼──────────┼───────────┼───────────┤
│    0    │  1  │   abcd    │   80%    │   12.34   │   56.78   │
│    1    │  2  │   efgh    │   60%    │   23.45   │   67.89   │
└─────────┴─────┴───────────┴──────────┴───────────┴───────────┘
```

#### **Supprimer un véhicule**
Supprimez un véhicule en spécifiant son ID :
```bash
vehicle-cli --address http://localhost:8080 delete-vehicle --id=1
```
Une fois supprimé avec succès, vous verrez ce message :
```
Vehicle with ID '1' was successfully deleted.
```


## 💡 Conseils
- Si une commande échoue :
  - Vérifiez que votre serveur est actif et accessible à l'adresse spécifiée avec `--address`.
  - Lisez attentivement les messages d'erreur pour ajuster vos options.
- Utilisez `--help` pour chaque commande pour consulter ses options et son usage.

Si le message d'erreur mentionne des détails comme "Shortcode must be only 4 characters long", corrigez vos options en conséquence. 

Voici un exemple d'une mauvaise requête :
```bash 
vehicle-cli --address http://localhost:8080 create-vehicle --shortcode abcdef --battery 50 --longitude 12.34 --latitude 56.78
```


## 🚀 Fonctionnalités

| Fonctionnalité           | Statut   |
|--------------------------|----------|
| Ajouter un véhicule      | ✅ Terminé |
| Lister les véhicules     | ✅ Terminé |
| Supprimer un véhicule    | ✅ Terminé |


## 🌲 Branches

- **main**: La branche principale contenant une version stable des fonctionnalités principales.
- **staging**: La branche de développement où de nouvelles fonctionnalités sont testées avant d’être intégrées dans `main`.
- **docker**: Une branche contenant une configuration Docker pour exécuter le projet. Bien que Docker soit fonctionnel, des erreurs subsistent dans cette version.



---

🎉 **Merci d'utiliser Vehicle CLI** ! Si vous avez des questions ou des suggestions, n'hésitez pas à ouvrir un ticket dans le dépôt GitHub.
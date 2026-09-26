# ioTactile — Blog

Application web de blog technique avec espace d’administration, authentification et gestion de contenu riche. Le front est construit avec **Nuxt 4** et **Vuetify 4** ; le backend s’appuie sur **Firebase** (Auth, Firestore, Storage, Cloud Functions, App Check).

---

## Fonctionnalités

- **Publication d’articles** — titre, description, contenu riche, illustrations et vidéos
- **Éditeur WYSIWYG** — TipTap (formatage, tableaux, liens, médias, YouTube, listes de tâches)
- **Espace public** — liste des articles, pages détail et à propos
- **Authentification** — connexion Firebase Auth, profil utilisateur
- **Administration** — gestion des articles et des utilisateurs (rôles admin)
- **Médias** — upload, redimensionnement d’images, Storage Firebase, drag & drop
- **Sécurité** — règles Firestore / Storage, App Check (reCAPTCHA v3), Cloud Functions protégées

---

## Stack technique

| Couche               | Technologies                                                 |
| -------------------- | ------------------------------------------------------------ |
| Front-end            | Nuxt 4, Vue 3, TypeScript, Vuetify 4, Pinia                  |
| Éditeur              | TipTap 3                                                     |
| Backend              | Firebase Auth, Firestore, Storage, Cloud Functions (Node 22) |
| Intégration Firebase | VueFire / nuxt-vuefire                                       |
| Qualité              | ESLint, Prettier, Husky, lint-staged                         |

---

## Prérequis

- **Node.js** ≥ 20 (22 recommandé pour les Cloud Functions)
- **npm** ≥ 10
- Compte **Firebase** avec le projet configuré
- Firebase CLI (`npm i -g firebase-tools`) pour le déploiement des functions
- Fichier de compte de service Firebase (non versionné) pour le développement local des functions

---

## Démarrage rapide

### 1. Cloner et installer

```bash
git clone <url-du-depot>
cd blog
npm install
cd functions && npm install && cd ..
```

### 2. Configuration

| Fichier                | Rôle                                                     |
| ---------------------- | -------------------------------------------------------- |
| `nuxt.config.ts`       | Config Firebase client, App Check, modules Nuxt          |
| `.env`                 | Variables locales (ex. `GOOGLE_APPLICATION_CREDENTIALS`) |
| `service-account.json` | Identifiants Admin SDK — **ne pas committer**            |

Exemple `.env` :

```env
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L’application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

### Application (racine)

| Commande           | Description                     |
| ------------------ | ------------------------------- |
| `npm run dev`      | Serveur de développement Nuxt   |
| `npm run build`    | Build de production             |
| `npm run preview`  | Prévisualiser le build          |
| `npm run generate` | Génération statique             |
| `npm run lint`     | ESLint + Prettier (contrôle)    |
| `npm run lintfix`  | Correction automatique du style |

### Cloud Functions (`functions/`)

| Commande         | Description                     |
| ---------------- | ------------------------------- |
| `npm run build`  | Compilation TypeScript → `lib/` |
| `npm run lint`   | Lint du package functions       |
| `npm run serve`  | Émulateurs Firebase (functions) |
| `npm run deploy` | Déploiement des functions       |

---

## Structure du projet

```text
blog/
├── assets/              # Styles SCSS, utilitaires (images, feature detection)
├── components/          # UI (éditeur TipTap, médias, auth, formulaires)
├── composables/         # Logique réutilisable (notifs, callable functions)
├── functions/           # Cloud Functions (createAdmin, removeAdmin)
├── layouts/             # Layouts public et admin
├── pages/               # Routes (articles, profil, admin)
├── plugins/             # Plugin Vuetify (thèmes clair / sombre)
├── stores/              # Stores Pinia + converters Firestore
├── firestore.rules      # Règles de sécurité Firestore
├── storage.rules        # Règles de sécurité Storage
├── firebase.json        # Config Firebase (functions, rules)
└── nuxt.config.ts       # Configuration Nuxt
```

### Routes principales

| Route            | Description                | SSR |
| ---------------- | -------------------------- | --- |
| `/`              | Liste des articles         | oui |
| `/articles/[id]` | Détail d’un article (slug) | oui |
| `/about`         | À propos                   | oui |
| `/profil`        | Profil utilisateur         | non |
| `/admin/*`       | Espace d’administration    | non |

---

## Architecture

```text
┌─────────────────┐     ┌──────────────────────┐
│  Nuxt / Vue UI  │────▶│  Firebase (client)   │
│  Vuetify + Pinia│     │  Auth · Firestore    │
└────────┬────────┘     │  Storage · App Check │
         │              └──────────┬───────────┘
         │ Callable                │
         ▼                         ▼
┌─────────────────┐     ┌──────────────────────┐
│ Cloud Functions │────▶│  Admin SDK           │
│ createAdmin     │     │  Auth claims · DB    │
│ removeAdmin     │     └──────────────────────┘
└─────────────────┘
```

- Les pages publiques sont rendues côté serveur ; l’admin et le profil sont en **SPA** (`routeRules`).
- Les rôles admin reposent sur des **custom claims** Auth, gérés via Cloud Functions avec **App Check** obligatoire.
- Les médias sont stockés dans **Firebase Storage** ; le redimensionnement côté client utilise **Pica**.

---

## Déploiement

### Front-end

```bash
npm run build
```

Déployez le contenu de `.output/` (ou le résultat de `generate`) sur l’hébergeur de votre choix (Node / static selon la cible).

### Firebase (rules + functions)

```bash
firebase login
firebase deploy
```

Déploiement ciblé :

```bash
firebase deploy --only functions
firebase deploy --only firestore:rules,storage
```

Le `predeploy` des functions exécute automatiquement `lint` puis `build`.

---

## Qualité de code

- **ESLint** (flat config) + **Prettier** sur l’application et les functions
- **Husky** + **lint-staged** : contrôle automatique avant chaque commit
- TypeScript strict côté functions ; Nuxt gère le typage du front

```bash
npm run lint
cd functions && npm run lint
```

---

## Sécurité

- Ne jamais versionner `service-account.json`, `.env` ni les clés secrètes
- Les règles Firestore / Storage doivent rester alignées avec les rôles Auth
- App Check (reCAPTCHA v3) protège les callables sensibles
- Les clés Firebase **client** dans `nuxt.config.ts` sont publiques par design ; la sécurité repose sur les rules et App Check

---

## Licence

Projet privé — tous droits réservés.

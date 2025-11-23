#  Alt-Endings  
### *Réécris la fin. Vote pour la meilleure.*

---

#  1. Pitch du projet

Alt-Endings est une plateforme où les utilisateurs peuvent explorer des œuvres cultes, proposer des fins alternatives, voter pour celles des autres, et gérer leurs propres contenus dans un espace personnel sécurisé.

---

#  2. Stack Technique

- **Next.js 14 (App Router)** — Server Components, Client Components, Layouts  
- **Supabase** — Auth, Base de données PostgreSQL, Storage, RLS  
- **Tailwind CSS** — Design responsive et moderne  
- **OMDb API** — Récupération d'informations officielles (durée, note IMDb)

---

#  3. Captures d’écran du projet

##  Page d’accueil  
![Page d’accueil](docs/works-grid.png)

##  Page d'une œuvre (infos + API OMDb)  
![Détail œuvre](docs/screenshots/détail.png)

##  Publication d'une fin  
![Publier fin](docs/screenshots/publication.png)

##  Page Mes fins  
![Mes fins](docs/screenshots/mesfins.png)

##  Votes  
![Votes](docs/screenshots/votes.png)

##  Page Mes œuvres (admin)  
![Mes œuvres](docs/screenshots/mesoeuvres.png)

---

#  4. Fonctionnalités principales

###  Authentification
- Inscription / Connexion / Déconnexion  
- Comptes **user** et **admin**  
- Interface mise à jour automatiquement selon l’état de session  
- Protection des pages (Mes fins, Mes œuvres, Publier une oeuvre)


###  Gestion des œuvres
- Liste filtrée par genre  
- Page détaillée  
- Ajout / modification / suppression (admin uniquement)  
- Upload d’affiches via Supabase Storage

###  Fins alternatives
- Ajouter une fin  
- Modifier ses propres fins  
- Supprimer avec confirmation  
- Page dédiée : **Mes fins**

###  Votes
- Un vote maximum par fin  
- Mise à jour dynamique  
- Protection via RLS (un user ne peut voter que pour lui-même, un utilisateur ne peut créer/voir/modifier des votes qui lui appartiennent, et pas ceux des autres.)

###  Sécurité (RLS)
- Chaque utilisateur ne modifie que ses données  
- Admin ne gère que ses propres œuvres  
- Fins modifiables uniquement par leur auteur  
- Votes protégés  
- Bucket *posters* configuré (lecture publique / upload authentifié)

###  Stockage
- Upload et affichage des affiches  
- Accessible publiquement

---

#  5. Installation en local

  1. Cloner le projet
bash
git clone <url-du-repo>
cd webtech-208-main

 2. Installer les dépendances
bash
Copier le code
npm install

 3. Ajouter les variables d’environnement
Créer client/.env.local :

env
Copier le code
NEXT_PUBLIC_SUPABASE_URL="https://jqfetarzqqberxrmskmy.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZmV0YXJ6cXFiZXJ4cm1za215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Nzg4ODUsImV4cCI6MjA3ODI1NDg4NX0.uEtidyu8qbq0pcxlyQQf2tV4AWzvsWhNmufvCfuMjbU"
NEXT_PUBLIC_OMDB_API_KEY="b7b6228e"

 4. Lancer l'application
bash
Copier le code
npm run dev
Accès via :
 http://localhost:3000

 5. Guide utilisateur
 Connexion
Inscription

Connexion automatique après signup

Déconnexion

Redirection automatique en fonction des droits

 Œuvres
Consultation des œuvres

Informations OMDb

Filtrage par genre

 Proposer une fin
Accessible aux utilisateurs connectés

Le champ created_by est automatiquement rempli

Interface sécurisée via RLS

 Mes fins
Voir toutes ses fins

Modifier / supprimer

Interface simple et fluide

 Votes
Limitation automatique

Mise à jour dynamique du compteur

 Espace admin
Ajouter une œuvre

Modifier / supprimer ses œuvres

Upload d’affiches via Storage

 6. Sécurité (RLS)
 profiles
Lecture et modification par le propriétaire uniquement

 works
CRUD uniquement pour l’admin associé

 endings
Lecture publique

Modification/suppression uniquement par l’auteur

 votes
Un user ne peut voter que pour lui-même

Un vote par fin

 storage.objects
Lecture publique du bucket posters

Upload authentifié

 7. Déploiement
 Supabase
Base de données

Auth

Storage

RLS activées

 Vercel
Variables à ajouter dans Environment Variables :

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_OMDB_API_KEY


 8. Tests manuels
Authentification : validé

CRUD œuvres (admin) : validé

CRUD fins : validé

Votes : validé

API OMDb : validé

Upload affiches : validé

RLS Supabase conforme : validé

Redirections login :validé

 # 6. Licence
Projet académique — ECE WebTech 2024–2025.

 # 7. Remerciements
Merci au professeur du cours, ainsi qu’aux technologies modernes Next.js, Supabase et OMDb API qui ont permis la réalisation de ce projet complet et formateur.

# 📘 PROJECT.md – Rapport Complet  
Projet : Alt-Endings – Plateforme d’histoires alternatives  
Technos : Next.js, React, Supabase, TailwindCSS  

## 🧑‍🤝‍🧑 Équipe
- Clément D'Alberto
- Luc Bernard Fernand BANAG LIBITE
- Omar El Alami

---

# 1. 🎯 Objectifs du projet
Créer une plateforme permettant à des utilisateurs de proposer des fins alternatives à des œuvres (films, séries, livres).  
Le projet devait intégrer :
- authentification
- base de données
- création/lecture/modification/suppression de contenus
- un rôle administrateur
- une interface moderne en React

---

# 2. 🏗️ Architecture technique

## 2.1. Stack
- Next.js 14 (App Router)
- Supabase (Auth + Database)
- React
- TailwindCSS
- Vercel compatible

## 2.2. Structure du code
```
client/
 ├── app/
 │   ├── admin/
 │   ├── works/
 │   ├── mes-fins/
 │   ├── login/
 │   └── signup/
 ├── components/
 ├── lib/
 └── public/
```

---

# 3. 🔒 Gestion des rôles et sécurité

## 3.1. Rôle utilisateur
```js
export async function getCurrentUserRole() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return profile?.role;
}
```

## 3.2. Protection de la page admin
```jsx
useEffect(() => {
  async function checkAuth() {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) router.push("/login");

    const userRole = await getCurrentUserRole();
    if (userRole !== "admin") router.push("/");
  }
  checkAuth();
}, []);
```

---

# 4. 🧩 Fonctionnalités implémentées

## 4.1. Authentification
- signup / login / logout
- récupération du profil utilisateur
- rôle stocké dans la table `profiles`

## 4.2. Les fins alternatives
- publication
- lecture
- édition
- suppression
- association d’une fin → utilisateur + œuvre

## 4.3. Page “Mes fins”
CRUD complet :
- afficher uniquement les fins de l’utilisateur
- modifier une fin
- supprimer une fin

## 4.4. Page Admin
- protégée
- visible uniquement dans la navbar si admin
- gestion des utilisateurs et des fins (selon évolution)

---

# 5. 🎨 Interface utilisateur
- Design en TailwindCSS
- Navigation adaptative selon le rôle
- Pages animées et responsives

---

# 6. 🧠 Difficultés rencontrées
- Gestion des rôles avec Supabase
- Routing dynamique dans Next.js
- Synchronisation des informations utilisateur
- Sécurisation des pages côté client

---

# 7. 🚀 Améliorations possibles
- Likes / commentaires
- Espace communautaire
- Page admin complète (CRUD sur users et œuvres)
- Classement des meilleures fins
- Déploiement sur Vercel

---

# 8. 📌 Conclusion
Le projet Alt-Endings répond à l’ensemble des exigences :  
✔ Authentification  
✔ Rôles  
✔ CRUD complet  
✔ Sécurisation  
✔ Interface moderne  

C’est une base solide pour une plateforme d’écriture interactive.


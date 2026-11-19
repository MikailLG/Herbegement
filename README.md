# TP Mise en production & Hébergement — Gestion de tickets

Application web trois tiers de suivi d'incidents informatiques.

## Architecture
- **Frontend** : Vercel (interface utilisateur)
- **Backend** : Render (API REST)[cite: 1, 4]
- **Base de données** : PostgreSQL sur Supabase
- **Code source** : GitHub

## Déploiement (résumé)
1. **BDD** : création de la base PostgreSQL sur Supabase et de la table `tickets`[cite: 3, 4].
2. **Backend** : déploiement sur Render depuis GitHub avec la variable d'environnement `DATABASE_URL` (aucun secret dans le code)[cite: 4].
3. **Frontend** : déploiement sur Vercel depuis GitHub avec l'URL publique de l'API Render[cite: 4].
4. **CI/CD** : redéploiement automatique déclenché à chaque `git push`[cite: 4].

## Liens publics
- **Frontend** : `https://...`[cite: 5]
- **API Backend** : `https://...`[cite: 5]

## Répartition du travail (groupe de 3)
- **[Mikail]** : Base de données Supabase + déploiement Backend sur Render + variables d'environnement.
- **[Ethan]** : Déploiement Frontend sur Vercel + liaison API + test de redéploiement auto (CI/CD).
- **[Manu]** : Dépôt GitHub, `README.md`, schéma d'architecture et compte rendu technique.
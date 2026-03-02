# 🔍 Guide de Recherche Avancée

## Fonctionnalités de la barre de recherche

La barre de recherche du CRM Arx Systema supporte désormais la recherche avancée avec exclusion de mots.

### 📝 Syntaxe de base

#### Recherche simple

Tapez un ou plusieurs mots séparés par des espaces :

```
restaurant paris
```

→ Trouve tous les prospects/partenariats contenant **"restaurant" ET "paris"**

#### Exclure des mots

Utilisez le préfixe `-` (moins) devant un mot pour l'exclure :

```
restaurant -italien
```

→ Trouve les restaurants **SAUF** les italiens

#### Combiner inclusions et exclusions

```
pecq urgente -restaurant
```

→ Prospects du Pecq avec priorité urgente, **hors** restaurants

```
coiffure -pecq -marly
```

→ Tous les coiffeurs **sauf** ceux du Pecq et de Marly

### 🎯 Exemples pratiques

| Recherche                      | Résultat                                 |
| ------------------------------ | ---------------------------------------- |
| `boulangerie`                  | Toutes les boulangeries                  |
| `boulangerie saint-nom`        | Boulangeries de Saint-Nom-la-Bretèche    |
| `restaurant -chinois -italien` | Restaurants sauf chinois et italiens     |
| `urgente -contacted`           | Prospects urgents pas encore contactés   |
| `web -site`                    | Prospects liés au web mais sans site     |
| `78560 -restaurant`            | Commerces du Port-Marly sauf restaurants |

### 📊 Champs recherchés

La recherche s'effectue dans tous ces champs :

**Pour les Prospects :**

- Nom entreprise
- Contact clé
- Ville
- Secteur
- Adresse
- Téléphone
- Email
- Canal
- Statut
- Notes
- Notes SEO
- Dernier contact
- Prochaine action
- Projet échéance
- Horaires
- Distance gare
- Priorité

**Pour les Partenariats :**

- Nom
- Profil
- Relation
- Engagement
- Action
- Origine
- Lien

### 💡 Astuces

1. **Recherche insensible à la casse** : `RESTAURANT`, `restaurant` ou `Restaurant` donnent le même résultat

2. **Mots multiples** : Tous les mots doivent être présents (ET logique)
   - `port marly restaurant` = doit contenir les 3 mots

3. **Exclusions multiples** : Vous pouvez exclure plusieurs mots
   - `commerce -boulangerie -coiffure -restaurant`

4. **Vérifier le nombre** : Le compteur de résultats s'affiche en temps réel

### ❓ Bouton d'aide

Cliquez sur le bouton **`?`** à droite de la barre de recherche pour afficher ce guide directement dans l'application.

---

**Version :** 2.0  
**Date :** 6 février 2026

# LeJardinDeReve — Déploiement Vercel + SumUp

Boutique de poulaillers avec checkout intégré SumUp Card Widget.

---

## 📁 Structure

```
lejardindereve/
├── index.html              ← ton site complet (SPA)
├── api/
│   └── create-checkout.js  ← fonction serverless Vercel (crée le checkout SumUp)
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Déploiement — 5 étapes

### 1. Pousser les fichiers sur GitHub

```bash
git init
git add .
git commit -m "Initial commit — LeJardinDeReve"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/lejardindereve.git
git push -u origin main
```

### 2. Connecter le repo à Vercel

1. Va sur https://vercel.com → **Login with GitHub**
2. Clique sur **Add New → Project**
3. Sélectionne le repo `lejardindereve`
4. Framework Preset : **Other** (laisse par défaut)
5. **Ne déploie pas encore** — clique sur "Environment Variables" d'abord

### 3. Ajouter les variables d'environnement

Dans l'écran de config du projet Vercel, section **Environment Variables**, ajoute :

| Variable               | Valeur                                              |
|------------------------|-----------------------------------------------------|
| `SUMUP_API_KEY`        | `sup_sk_...` (ta clé API secrète SumUp)            |
| `SUMUP_MERCHANT_CODE`  | `MBJJSJBR`                                          |

⚠️ **Important** :
- Pars en **sandbox d'abord** : `sup_sk_test_...` et un merchant_code de sandbox
- Une fois que tout marche, tu peux passer en live en remplaçant uniquement ces 2 variables
- Ne commite **jamais** ta clé dans le code

### 4. Déployer

Clique sur **Deploy**. Vercel build en ~30 secondes et te donne une URL type `https://lejardindereve.vercel.app`.

### 5. Autoriser le domaine côté SumUp

Dans ton dashboard SumUp Developer :
- Va dans **Client Credentials** ou **API Keys**
- Ajoute ton domaine Vercel (`lejardindereve.vercel.app`) aux **JavaScript Origins autorisées**
- Sans ça, le widget refusera de se monter

---

## 🧪 Tester en sandbox

SumUp fournit une carte test qui simule un paiement réussi :

- **Numéro** : `4200 0000 0000 0000`
- **Expiration** : n'importe quelle date future (ex. `12/30`)
- **CVC** : `123`

Autres scénarios (refus, 3DS, etc.) : https://developer.sumup.com/online-payments/features/test-cards

---

## 🔧 Debug

- **Widget affiche une erreur "Checkout not found"** → mauvais `SUMUP_MERCHANT_CODE` ou clé API invalide. Vérifie les logs Vercel (onglet "Logs" du projet).
- **Widget ne s'affiche pas du tout** → domaine pas ajouté aux JavaScript Origins côté SumUp.
- **Erreur CORS** → l'appel `/api/create-checkout` part pas du même domaine que ton site. Vérifie que le frontend et l'API sont bien sur le même projet Vercel.
- **Logs serveur** : Vercel Dashboard → ton projet → Deployments → clique sur le dernier → Runtime Logs.

---

## 💳 Passer en production

1. Génère une clé API **live** (pas `test_`) sur ton compte marchand SumUp
2. Récupère ton `merchant_code` live (différent du sandbox)
3. Sur Vercel → Settings → Environment Variables → remplace les 2 variables
4. Redeploy (Deployments → clique sur "..." → Redeploy)
5. Ajoute ton domaine final (si custom) aux JavaScript Origins SumUp

---

## 📚 Docs utiles

- Card Widget SumUp : https://developer.sumup.com/online-payments/checkouts/card-widget
- API SumUp : https://developer.sumup.com/api
- Vercel Functions : https://vercel.com/docs/functions

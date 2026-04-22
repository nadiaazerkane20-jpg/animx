// api/create-checkout.js
// Vercel serverless function — crée un checkout SumUp côté serveur
// La clé API SumUp reste secrète dans les variables d'environnement Vercel

export default async function handler(req, res) {
  // CORS — autorise ton domaine (ajuste si besoin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { SUMUP_API_KEY, SUMUP_MERCHANT_CODE } = process.env;

  if (!SUMUP_API_KEY || !SUMUP_MERCHANT_CODE) {
    console.error('Missing SUMUP_API_KEY or SUMUP_MERCHANT_CODE env vars');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const { amount, currency = 'EUR', reference, description, email } = req.body || {};

    // Validation basique
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount invalide' });
    }

    const payload = {
      checkout_reference: reference || `LJDR-${Date.now()}`,
      amount: Number(amount),
      currency,
      merchant_code: SUMUP_MERCHANT_CODE,
      description: description || 'Commande LeJardinDeReve',
    };

    if (email) payload.customer_email = email;

    // Appel serveur-à-serveur vers l'API SumUp
    const sumupRes = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUMUP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await sumupRes.json();

    if (!sumupRes.ok) {
      console.error('SumUp API error:', data);
      return res.status(sumupRes.status).json({
        error: 'SumUp checkout creation failed',
        details: data,
      });
    }

    // Renvoie l'id du checkout au frontend — c'est ce qu'il faut au widget
    return res.status(200).json({
      id: data.id,
      checkout_reference: data.checkout_reference,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

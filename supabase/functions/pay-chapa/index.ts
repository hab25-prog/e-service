import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS Pre-flight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, email, user_id, plan_name } = await req.json()
    
    // Create a unique reference for Chapa
    const tx_ref = `tx-${user_id.slice(0, 5)}-${Date.now()}`

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("CHAPA_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        currency: "ETB",
        email: email,
        tx_ref: tx_ref,
        callback_url: "https://your-domain.com/api/verify", // Change this when you have a live URL
        return_url: `http://localhost:5173/tech/subscription?status=success`,
        // Flat structure for customization is often safer with Chapa
        "customization[title]": "Technician Subscription",
        "customization[description]": `Payment for ${plan_name} plan`,
      }),
    })

    const result = await response.json()

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
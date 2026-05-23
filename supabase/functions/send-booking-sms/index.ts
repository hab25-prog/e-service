import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const payload = await req.json()
    
    // 1. Only run this if a BRAND NEW job request is created
    if (payload.type === 'INSERT' && payload.record.status === 'pending') {
      const job = payload.record;

      // 2. Initialize Supabase with Master Admin keys to bypass security checks internally
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // 3. Fetch the specific technician's phone number and name
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('phone_number, full_name')
        .eq('id', job.technician_id)
        .single()

      if (profileError) throw profileError;

      if (profile?.phone_number) {
        console.log(`[SMS Alert Log]: Sending text to ${profile.full_name} at ${profile.phone_number}`);
        
        // 💡 THIS IS WHERE YOUR SMS PROVIDER INTEGRATION SITS
        // When you're ready, you can hook up your local SMS provider here (e.g., Africa's Talking, Twilio, etc.):
        /*
        await fetch("https://api.your-sms-vendor.com/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: profile.phone_number,
            message: `Hello ${profile.full_name}, a customer just booked you for a job! Please log into the app to view and accept it.`
          })
        });
        */
      }
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" } 
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    })
  }
})
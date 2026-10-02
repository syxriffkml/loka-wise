import pricing from '../_shared/pricing.json' with {type:'json'};
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import Stripe from 'npm:stripe@18.5.0';

Deno.serve(async(req:Request)=>{
 if(req.method!=='POST')return new Response('Method not allowed',{status:405});
 const key=Deno.env.get('STRIPE_SECRET_KEY')||'';const secret=Deno.env.get('STRIPE_WEBHOOK_SECRET');
 if(!key.startsWith('sk_test_')||!secret)return new Response('Test integration unavailable',{status:503});
 const signature=req.headers.get('stripe-signature');if(!signature)return new Response('Missing signature',{status:400});
 const stripe=new Stripe(key,{httpClient:Stripe.createFetchHttpClient()});let event:Stripe.Event;
 try{event=await stripe.webhooks.constructEventAsync(await req.text(),signature,secret,undefined,Stripe.createSubtleCryptoProvider());}catch{return new Response('Invalid signature',{status:400});}
 if(event.livemode)return new Response('Live events are not accepted',{status:400});
 if(event.type!=='checkout.session.completed')return new Response('Ignored',{status:200});
 const session=event.data.object as Stripe.Checkout.Session;
 if(session.payment_status!=='paid')return new Response('Not paid',{status:200});
 const userId=session.metadata?.user_id;const requestId=session.metadata?.request_id;
 if(!userId||!requestId||session.metadata?.service_id!==pricing.id||session.amount_total!==pricing.amount||session.currency!=='myr'||session.client_reference_id!==userId)return new Response('Invalid order metadata',{status:400});
 const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 const {data:brief}=await db.from('requests').select('id').eq('id',requestId).eq('user_id',userId).eq('kind','report').single();
 if(!brief)return new Response('Invalid request',{status:400});
 const {error}=await db.from('orders').upsert({user_id:userId,stripe_session_id:session.id,request_id:requestId,service_id:pricing.id,status:'paid_test',amount:pricing.amount,currency:'myr'},{onConflict:'stripe_session_id',ignoreDuplicates:true});
 if(error){console.error('Order write failed',error.code);return new Response('Retry later',{status:500});}
 return new Response('Recorded',{status:200});
});

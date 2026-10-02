import pricing from '../_shared/pricing.json' with {type:'json'};
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import Stripe from 'npm:stripe@18.5.0';

Deno.serve(async(req:Request)=>{
 const appUrl=Deno.env.get('APP_URL')?.replace(/\/$/,'');
 const headers={'Access-Control-Allow-Origin':appUrl||'null','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Content-Type':'application/json'};
 const respond=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{headers});
 if(req.method!=='POST')return respond(405,{error:'Method not allowed'});
 if(!appUrl||req.headers.get('origin')!==appUrl)return respond(403,{error:'Origin not allowed'});
 const key=Deno.env.get('STRIPE_SECRET_KEY')||'';
 if(!key.startsWith('sk_test_'))return respond(503,{error:'Stripe test mode is not configured. Live keys are refused.'});
 try{
  const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');
  if(!token)return respond(401,{error:'Sign in required'});
  const auth=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!);
  const {data,error}=await auth.auth.getUser(token);
  if(error||!data.user)return respond(401,{error:'Invalid session'});
  const {request_id}=await req.json();
  if(typeof request_id!=='string')return respond(400,{error:'Request required'});
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:`Bearer ${token}`}}});
  const {data:brief,error:briefError}=await db.from('requests').select('id,kind,user_id').eq('id',request_id).eq('user_id',data.user.id).single();
  if(briefError||brief?.kind!=='report')return respond(404,{error:'Custom report request not found'});
  const stripe=new Stripe(key,{httpClient:Stripe.createFetchHttpClient()});
  const session=await stripe.checkout.sessions.create({mode:'payment',payment_method_types:['card'],customer_email:data.user.email,client_reference_id:data.user.id,metadata:{user_id:data.user.id,request_id,service_id:pricing.id},line_items:[{quantity:1,price_data:{currency:pricing.currency,unit_amount:pricing.amount,product_data:{name:'LOKA WISE custom feasibility report - TEST',description:'Business challenge exhibition. No real payment. Demonstration pricing.'}}}],success_url:`${appUrl}/?checkout=returned#dashboard`,cancel_url:`${appUrl}/?checkout=cancelled#dashboard`});
  return respond(200,{url:session.url});
 }catch(error){console.error('Test checkout failed',error instanceof Error?error.message:'unknown');return respond(500,{error:'Unable to create test checkout. Please try again.'});}
});

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME="teos_session";

if(!process.env.SESSION_SECRET){
 throw new Error("SESSION_SECRET missing");
}

const secret = new TextEncoder().encode(
 process.env.SESSION_SECRET
);

export async function setSession(email:string){
 const token = await new SignJWT({email})
   .setProtectedHeader({alg:"HS256"})
   .setIssuedAt()
   .setExpirationTime("7d")
   .sign(secret);

 const cookieStore = await cookies();

 cookieStore.set(COOKIE_NAME,token,{
   httpOnly:true,
   secure:process.env.NODE_ENV==="production",
   sameSite:"lax",
   path:"/",
   maxAge:60*60*24*7
 });
}

export async function getSessionEmail(){
 try{
   const cookieStore=await cookies();
   const token=cookieStore.get(COOKIE_NAME)?.value;

   if(!token) return null;

   const {payload}=await jwtVerify(
      token,
      secret
   );

   return typeof payload.email==="string"
      ? payload.email
      : null;

 }catch{
   return null;
 }
}

export async function clearSession(){
 const cookieStore=await cookies();

 cookieStore.set(COOKIE_NAME,"",{
   path:"/",
   maxAge:0
 });
}
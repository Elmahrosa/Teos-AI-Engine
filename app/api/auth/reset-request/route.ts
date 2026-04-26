import { NextResponse } from "next/server";

export async function POST(req:Request){
const body=await req.json();

console.log("Password reset requested:",body.email);

// later hook Resend / SendGrid

return NextResponse.json({
ok:true
});
}
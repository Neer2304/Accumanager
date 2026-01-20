import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  // Ensure this EXACT string is what is in your GitHub settings
  const redirectUri = process.env.GITHUB_CALLBACK_URL; 
  
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Missing GitHub Config in .env" }, { status: 500 });
  }

  // Constructing the URL manually to ensure no hidden encoding issues
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email&state=accumanage_secure_state`;

  return NextResponse.redirect(githubUrl);
}
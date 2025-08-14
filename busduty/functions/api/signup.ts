export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const { schoolName, adminEmail, expectedBuses, timezone } = await request.json();
  
  // Validate input
  if (!schoolName || !adminEmail || !expectedBuses) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Generate school code (simple version - in production, check for uniqueness)
  const schoolCode = schoolName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 8) + 
    Math.random().toString(36).substring(2, 7);
  
  // Generate 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store verification code in D1 (expires in 15 minutes)
  const expiresAt = Math.floor(Date.now() / 1000) + (15 * 60);
  
  try {
    await env.BUS_DB.prepare(
      `INSERT INTO verification_codes (email, code, type, expires_at) 
       VALUES (?1, ?2, 'signup', ?3)`
    ).bind(adminEmail, verificationCode, expiresAt).run();
    
    // Store pending school data in KV (temporary until verified)
    await env.BUS_CONFIG.put(
      `pending:${adminEmail}`,
      JSON.stringify({
        schoolCode,
        schoolName,
        adminEmail,
        expectedBuses: parseInt(expectedBuses),
        timezone
      }),
      { expirationTtl: 900 } // 15 minutes
    );
    
    // TODO: Send email with verification code
    // For now, we'll just log it (in production, use a service like Resend or SendGrid)
    console.log(`Verification code for ${adminEmail}: ${verificationCode}`);
    
    // In development, return the code (remove in production!)
    if (env.ENVIRONMENT === 'development') {
      return Response.json({ 
        message: 'Verification code sent',
        devCode: verificationCode // REMOVE IN PRODUCTION
      });
    }
    
    return Response.json({ message: 'Verification code sent to your email' });
    
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Failed to create account' }, { status: 500 });
  }
};
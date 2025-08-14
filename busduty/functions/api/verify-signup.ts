export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const { email, code } = await request.json();
  
  if (!email || !code) {
    return Response.json({ error: 'Missing email or code' }, { status: 400 });
  }
  
  try {
    // Check verification code
    const result = await env.BUS_DB.prepare(
      `SELECT * FROM verification_codes 
       WHERE email = ?1 AND code = ?2 AND type = 'signup' 
       AND used = 0 AND expires_at > ?3`
    ).bind(email, code, Math.floor(Date.now() / 1000)).first();
    
    if (!result) {
      return Response.json({ error: 'Invalid or expired code' }, { status: 400 });
    }
    
    // Mark code as used
    await env.BUS_DB.prepare(
      `UPDATE verification_codes SET used = 1 WHERE id = ?1`
    ).bind(result.id).run();
    
    // Get pending school data from KV
    const pendingData = await env.BUS_CONFIG.get(`pending:${email}`);
    if (!pendingData) {
      return Response.json({ error: 'Signup session expired' }, { status: 400 });
    }
    
    const schoolData = JSON.parse(pendingData);
    
    // Generate PINs
    const busdutyPin = Math.floor(1000 + Math.random() * 9000).toString();
    const officePin = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Create school in database
    await env.BUS_DB.prepare(
      `INSERT INTO schools (
        school_code, school_name, admin_email, 
        expected_buses, timezone, busduty_pin, office_pin, verified_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
    ).bind(
      schoolData.schoolCode,
      schoolData.schoolName,
      schoolData.adminEmail,
      schoolData.expectedBuses,
      schoolData.timezone,
      busdutyPin,
      officePin,
      Math.floor(Date.now() / 1000)
    ).run();
    
    // Create default buses for the school
    const buses = [];
    for (let i = 1; i <= schoolData.expectedBuses; i++) {
      buses.push({
        bus_no: i.toString(),
        display_name: `Bus ${i}`,
        active: true
      });
    }
    
    await env.BUS_CONFIG.put(
      `buses:${schoolData.schoolCode}`,
      JSON.stringify(buses)
    );
    
    // Clean up pending data
    await env.BUS_CONFIG.delete(`pending:${email}`);
    
    // TODO: Send welcome email with PINs
    console.log(`Welcome email for ${email} with PINs:`, { busdutyPin, officePin });
    
    return Response.json({
      schoolCode: schoolData.schoolCode,
      schoolName: schoolData.schoolName,
      busdutyPin,
      officePin,
      message: 'School account created successfully!'
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json({ error: 'Failed to verify account' }, { status: 500 });
  }
};
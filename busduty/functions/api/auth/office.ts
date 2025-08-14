export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const { pin, school } = await request.json();
  
  if (!pin || !school) {
    return Response.json({ error: 'Missing credentials' }, { status: 400 });
  }
  
  try {
    // Check against schools table
    const result = await env.BUS_DB.prepare(
      `SELECT school_name, office_pin FROM schools 
       WHERE school_code = ?1 AND verified_at IS NOT NULL`
    ).bind(school).first();
    
    if (result && result.office_pin === pin) {
      return Response.json({ 
        ok: true,
        role: 'office',
        schoolName: result.school_name
      });
    }
    
    // Fallback for existing hardcoded school
    if (pin === "1234" && school === "mpjh11243") {
      return Response.json({ ok: true, role: 'office' });
    }
    
    return new Response("Invalid PIN", { status: 401 });
  } catch (error) {
    // If schools table doesn't exist yet, fallback to hardcoded
    if (pin === "1234" && school === "mpjh11243") {
      return Response.json({ ok: true, role: 'office' });
    }
    
    return new Response("Invalid PIN", { status: 401 });
  }
};
export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);
  const school = url.searchParams.get("school")!;
  const body = await request.json(); // { bus_no, entrance? }
  const date_ymd = new Date().toISOString().slice(0,10);
  
  // For local dev, insert directly to D1
  await env.BUS_DB.prepare(
    "INSERT OR IGNORE INTO arrivals (school_code,bus_no,date_ymd,ts_utc,entrance) VALUES (?1,?2,?3,unixepoch(),?4)"
  ).bind(school, body.bus_no, date_ymd, body.entrance ?? null).run();
  
  // Return updated state
  const arrivedResult = await env.BUS_DB.prepare(
    "SELECT bus_no, ts_utc, entrance FROM arrivals WHERE school_code=?1 AND date_ymd=?2 ORDER BY ts_utc ASC"
  ).bind(school, date_ymd).all();
  const arrived = arrivedResult.results || [];

  const list = await env.BUS_CONFIG.get(`buses:${school}`, "json") as { bus_no: string; display_name?: string }[] || [];
  const arrivedSet = new Set(arrived.map((a:any)=>a.bus_no));
  const remaining = list.filter(b=>!arrivedSet.has(b.bus_no));

  return Response.json({ date_ymd, arrived, remaining });
};
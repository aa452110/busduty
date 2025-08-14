export const onRequestGet: PagesFunction = async ({ env, request }) => {
  const school = new URL(request.url).searchParams.get("school")!;
  const date_ymd = new Date().toISOString().slice(0,10);
  
  // Check if day is marked as complete
  const completeData = await env.BUS_CONFIG.get(`complete:${school}:${date_ymd}`, "json");
  
  // For local dev, query D1 directly
  const arrivedResult = await env.BUS_DB.prepare(
    "SELECT bus_no, ts_utc, entrance FROM arrivals WHERE school_code=?1 AND date_ymd=?2 ORDER BY ts_utc ASC"
  ).bind(school, date_ymd).all();
  const arrived = arrivedResult.results || [];

  // Compute remaining from KV bus list
  const list = await env.BUS_CONFIG.get(`buses:${school}`, "json") as { bus_no: string; display_name?: string }[] || [];
  const arrivedSet = new Set(arrived.map((a:any)=>a.bus_no));
  const remaining = list.filter(b=>!arrivedSet.has(b.bus_no));

  return Response.json({ 
    date_ymd, 
    arrived, 
    remaining,
    completed: completeData ? true : false,
    completed_at: completeData?.completed_at || null
  });
};
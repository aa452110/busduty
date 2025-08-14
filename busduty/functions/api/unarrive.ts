export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const school = new URL(request.url).searchParams.get("school")!;
  const { bus_no } = await request.json() as { bus_no: string };
  const date_ymd = new Date().toISOString().slice(0, 10);
  
  // Delete the arrival record
  await env.BUS_DB.prepare(
    "DELETE FROM arrivals WHERE school_code=?1 AND bus_no=?2 AND date_ymd=?3"
  ).bind(school, bus_no, date_ymd).run();
  
  // Return updated state
  const arrivedResult = await env.BUS_DB.prepare(
    "SELECT bus_no, ts_utc, entrance FROM arrivals WHERE school_code=?1 AND date_ymd=?2 ORDER BY ts_utc ASC"
  ).bind(school, date_ymd).all();
  const arrived = arrivedResult.results || [];
  
  const list = await env.BUS_CONFIG.get(`buses:${school}`, "json") as { bus_no: string; display_name?: string }[] || [];
  const arrivedSet = new Set(arrived.map((a:any)=>a.bus_no));
  const remaining = list.filter(b=>!arrivedSet.has(b.bus_no));
  
  return Response.json({ ok: true, arrived, remaining });
};
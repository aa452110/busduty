function toCSV(rows: any[]) {
  const header = "school_code,bus_no,date_ymd,ts_utc,entrance";
  const body = rows.map(r=>[r.school_code,r.bus_no,r.date_ymd,r.ts_utc,r.entrance??""].join(",")).join("\n");
  return header+"\n"+body;
}
export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const school = new URL(request.url).searchParams.get("school")!;
  const date_ymd = new Date().toISOString().slice(0,10);
  const rows = await env.BUS_DB.prepare(
    "SELECT school_code,bus_no,date_ymd,ts_utc,entrance FROM arrivals WHERE school_code=?1 AND date_ymd=?2 ORDER BY ts_utc ASC"
  ).bind(school, date_ymd).all();

  const csv = toCSV(rows.results);
  const key = `${school}/${date_ymd}.csv`;
  await env.ARCHIVES.put(key, new Blob([csv], { type: "text/csv" }));

  // Mark the day as complete in KV for office view to detect
  await env.BUS_CONFIG.put(`complete:${school}:${date_ymd}`, JSON.stringify({
    completed_at: Date.now(),
    total_buses: rows.results.length
  }), { expirationTtl: 86400 }); // Expire after 24 hours

  return Response.json({ ok: true, r2_key: key });
};
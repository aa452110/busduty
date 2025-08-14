export const onRequestGet: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);
  const school = url.searchParams.get("school")!;
  const date = url.searchParams.get("date")!;
  
  // Fetch arrivals for the specific date from D1
  const arrivedResult = await env.BUS_DB.prepare(
    "SELECT bus_no, ts_utc, entrance FROM arrivals WHERE school_code=?1 AND date_ymd=?2 ORDER BY ts_utc ASC"
  ).bind(school, date).all();
  
  const arrivals = arrivedResult.results || [];
  
  // Check if this date has a CSV archive
  const csvKey = `${school}/${date}.csv`;
  let hasArchive = false;
  
  try {
    const archive = await env.ARCHIVES.head(csvKey);
    hasArchive = !!archive;
  } catch (error) {
    // Archive doesn't exist
  }
  
  return Response.json({ 
    date,
    arrivals,
    hasArchive,
    totalBuses: arrivals.length
  });
};
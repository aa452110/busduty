export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const school = new URL(request.url).searchParams.get("school")!;
  const { buses } = await request.json() as { buses: { bus_no: string; display_name?: string }[] };
  
  // Update the bus list in KV
  await env.BUS_CONFIG.put(`buses:${school}`, JSON.stringify(buses));
  
  return Response.json({ ok: true, buses });
};
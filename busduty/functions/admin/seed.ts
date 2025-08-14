export const onRequestPost: PagesFunction = async ({ env }) => {
  const school = "mpjh11243";
  const buses = [
    { bus_no: "7", display_name: "Bus 7" },
    { bus_no: "12", display_name: "Bus 12" },
    { bus_no: "22", display_name: "Bus 22" }
  ];
  await env.BUS_CONFIG.put(`buses:${school}`, JSON.stringify(buses));
  return new Response("ok");
};
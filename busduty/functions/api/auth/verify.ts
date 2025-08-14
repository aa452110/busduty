export const onRequestPost: PagesFunction = async ({ env, request }) => {
  const { token } = await request.json();
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type":"application/json" },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token })
  });
  const j = await r.json();
  return Response.json({ ok: !!j.success });
};
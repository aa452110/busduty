import { DurableObject } from "cloudflare:workers";

export interface Env {
  BUS_DB: D1Database;
}

export class BusHub extends DurableObject {
  state: DurableObjectState; env: Env;
  constructor(state: DurableObjectState, env: Env) { super(state, env); this.state = state; this.env = env; }

  // Helper: YYYY-MM-DD in UTC
  private today(): string { return new Date().toISOString().slice(0,10); }

  async fetch(req: Request) {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/arrive") {
      const { bus_no, school_code, entrance } = await req.json();
      const date_ymd = this.today();
      // idempotent insert
      await this.env.BUS_DB.exec(
        "INSERT OR IGNORE INTO arrivals (school_code,bus_no,date_ymd,ts_utc,entrance) VALUES (?1,?2,?3,unixepoch(),?4)",
        [school_code, bus_no, date_ymd, entrance ?? null]
      );
      return new Response(JSON.stringify({ ok: true }), { headers: { "content-type":"application/json" }});
    }

    if (req.method === "GET" && url.pathname === "/state") {
      const school_code = url.searchParams.get("school")!;
      const date_ymd = this.today();
      const arrived = await this.env.BUS_DB.prepare(
        "SELECT bus_no, ts_utc, entrance FROM arrivals WHERE school_code=?1 AND date_ymd=?2 ORDER BY ts_utc ASC"
      ).bind(school_code, date_ymd).all();
      return new Response(JSON.stringify({ date_ymd, arrived: arrived.results }), { headers: { "content-type":"application/json" }});
    }

    if (req.method === "POST" && url.pathname === "/done") {
      // no-op here; Pages Function will generate CSV from D1
      await this.state.storage.deleteAll(); // drop any ephemeral state if added later
      return new Response(JSON.stringify({ ok: true }), { headers: { "content-type":"application/json" }});
    }

    return new Response("Not found", { status: 404 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return new Response("Bus Hub DO Worker", { status: 200 });
  }
};
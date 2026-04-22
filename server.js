const http = require("http");
const fs = require("fs");
const { readFile } = require("fs/promises");
const { createHash, randomUUID } = require("crypto");
const path = require("path");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf8");
  raw
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const idx = line.indexOf("=");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    });
}

const PORT = Number(process.env.PORT || 8000);
const SQUARE_ENV = process.env.SQUARE_ENV || "sandbox";
const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID || "";
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || "";
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || "";

const baseUrl =
  SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const createPayment = async ({ token, amount, currency }) => {
  const response = await fetch(`${baseUrl}/v2/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      idempotency_key: randomUUID(),
      source_id: token,
      location_id: SQUARE_LOCATION_ID,
      amount_money: {
        amount,
        currency
      }
    })
  });

  const data = await response.json();
  return { status: response.status, data };
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/config") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        applicationId: SQUARE_APPLICATION_ID,
        locationId: SQUARE_LOCATION_ID,
        environment: SQUARE_ENV
      })
    );
    return;
  }

  if (req.method === "POST" && req.url === "/api/pay") {
    try {
      if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            errors: [
              {
                detail:
                  "Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID."
              }
            ]
          })
        );
        return;
      }

      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      if (!payload.token || !payload.amount) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            errors: [{ detail: "Missing token or amount." }]
          })
        );
        return;
      }

      const { status, data } = await createPayment({
        token: payload.token,
        amount: payload.amount,
        currency: payload.currency || "USD"
      });
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          errors: [{ detail: "Server error processing payment." }]
        })
      );
    }
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(405);
    res.end();
    return;
  }

  const reqPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = reqPath.split("?")[0];
  const filePath = path.join(__dirname, safePath);

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  const hash = createHash("md5").update(String(Date.now())).digest("hex");
  console.log(`Wolf Shack server running on http://localhost:${PORT}`);
  console.log(`Session ${hash.slice(0, 6)} (${SQUARE_ENV})`);
});

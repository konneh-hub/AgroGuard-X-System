const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());

function createJwt(payload = {}) {
  const header = Buffer.from(
    JSON.stringify({ alg: "none", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  // signature not required for jwt-decode usage
  return `${header}.${body}.`;
}

app.post("/auth/register", (req, res) => {
  const { email, phone, password, fullName, role } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "missing fields" });
  // issue a verification token
  const verificationToken = crypto.randomBytes(16).toString("hex");
  // store a simple in-memory mapping
  app.locals.verifications = app.locals.verifications || {};
  app.locals.verifications[verificationToken] = {
    email,
    phone,
    fullName,
    role,
  };
  res.json({ verificationToken });
});

app.post("/auth/verify-otp", (req, res) => {
  const { otp, verificationToken, channel } = req.body;
  const record =
    app.locals.verifications && app.locals.verifications[verificationToken];
  if (!record) return res.status(400).json({ error: "invalid token" });
  // create dummy tokens with payload usable by jwt-decode
  const now = Math.floor(Date.now() / 1000);
  const access = createJwt({
    sub: crypto.randomUUID(),
    role: record.role || "FARMER",
    exp: now + 60 * 60,
  });
  const refresh = createJwt({
    sub: crypto.randomUUID(),
    role: record.role || "FARMER",
    exp: now + 60 * 60 * 24 * 30,
  });
  res.json({ accessToken: access, refreshToken: refresh });
});

app.post("/auth/login", (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password)
    return res.status(400).json({ error: "missing fields" });
  const now = Math.floor(Date.now() / 1000);
  const access = createJwt({
    sub: crypto.randomUUID(),
    role: "FARMER",
    exp: now + 60 * 60,
  });
  const refresh = createJwt({
    sub: crypto.randomUUID(),
    role: "FARMER",
    exp: now + 60 * 60 * 24 * 30,
  });
  res.json({ accessToken: access, refreshToken: refresh });
});

app.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "missing refresh" });
  const now = Math.floor(Date.now() / 1000);
  const access = createJwt({
    sub: crypto.randomUUID(),
    role: "FARMER",
    exp: now + 60 * 60,
  });
  const refresh = createJwt({
    sub: crypto.randomUUID(),
    role: "FARMER",
    exp: now + 60 * 60 * 24 * 30,
  });
  res.json({ accessToken: access, refreshToken: refresh });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Mock auth server listening on http://localhost:" + port);
});

(async function () {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3001";
  console.log("Using base", base);
  const fetch = globalThis.fetch || (await import("node-fetch")).default;

  const regRes = await fetch(base + "/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "smoke@test.local",
      phone: "+23270000001",
      password: "password",
      fullName: "Smoke Test",
      role: "FARMER",
    }),
  });
  const reg = await regRes.json();
  console.log("register ->", regRes.status, reg);

  const token = reg.verificationToken;
  if (!token) {
    console.error("No verification token returned");
    process.exit(1);
  }

  const verifyRes = await fetch(base + "/auth/verify-otp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      otp: "1234",
      verificationToken: token,
      channel: "email",
    }),
  });
  const verify = await verifyRes.json();
  console.log("verify ->", verifyRes.status, verify);

  const loginRes = await fetch(base + "/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      emailOrPhone: "smoke@test.local",
      password: "password",
    }),
  });
  const login = await loginRes.json();
  console.log("login ->", loginRes.status, login);
})();

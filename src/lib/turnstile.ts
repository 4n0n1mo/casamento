export async function verifyTurnstileToken(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
    // no-store: verificação deve ser sempre dinâmica
    cache: "no-store"
  });

  if (!res.ok) return { ok: false, error: `http_${res.status}` };

  const data = (await res.json()) as { success: boolean };
  return { ok: Boolean(data?.success) };
}

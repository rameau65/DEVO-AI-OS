export function requireSecret(req: Request, envName = "DEVO_API_SECRET") {
  const requiredSecret = process.env[envName];
  if (!requiredSecret) return;

  const secret =
    req.headers.get("x-devo-secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (secret !== requiredSecret) {
    throw new Error("Unauthorized: missing or invalid API secret.");
  }
}

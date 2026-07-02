import { Octokit } from "@octokit/rest";

export function getGitHubConfig() {
  return {
    owner: process.env.GITHUB_OWNER || "rameau65",
    repo: process.env.GITHUB_REPO || "DEVO-AI-OS",
    defaultBranch: process.env.GITHUB_DEFAULT_BRANCH || "main",
  };
}

export function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN environment variable.");
  return new Octokit({ auth: token });
}

export function requireApiSecret(req: Request, envName = "GITHUB_API_SECRET") {
  const requiredSecret = process.env[envName];
  if (!requiredSecret) return;

  const secret =
    req.headers.get("x-devo-secret") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (secret !== requiredSecret) {
    throw new Error("Unauthorized: missing or invalid API secret.");
  }
}

export function encodeBase64(content: string) {
  return Buffer.from(content, "utf-8").toString("base64");
}

export function decodeBase64(content: string) {
  return Buffer.from(content, "base64").toString("utf-8");
}

import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DEFAULT_OWNER = process.env.GITHUB_OWNER || "rameau65";
const DEFAULT_REPO = process.env.GITHUB_REPO || "DEVO-AI-OS";

async function githubFetch(path: string, options: RequestInit = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error("Missing GITHUB_TOKEN environment variable.");
  }

  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "GitHub API error");
  }

  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const owner = body.owner || DEFAULT_OWNER;
    const repo = body.repo || DEFAULT_REPO;
    const action = body.action;

    if (action === "read_file") {
      const path = body.path;
      const branch = body.branch || "main";

      const data = await githubFetch(
        `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
      );

      const content = Buffer.from(data.content, "base64").toString("utf-8");

      return NextResponse.json({ ok: true, path, content, sha: data.sha });
    }

    if (action === "write_file") {
      const path = body.path;
      const content = body.content;
      const message = body.message || `Update ${path}`;
      const branch = body.branch || "main";

      let sha: string | undefined;

      try {
        const existing = await githubFetch(
          `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
        );
        sha = existing.sha;
      } catch {
        sha = undefined;
      }

      const data = await githubFetch(`/repos/${owner}/${repo}/contents/${path}`, {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: Buffer.from(content).toString("base64"),
          branch,
          sha,
        }),
      });

      return NextResponse.json({ ok: true, data });
    }

    if (action === "create_branch") {
      const base = body.base || "main";
      const branch = body.branch;

      const refData = await githubFetch(
        `/repos/${owner}/${repo}/git/ref/heads/${base}`
      );

      const data = await githubFetch(`/repos/${owner}/${repo}/git/refs`, {
        method: "POST",
        body: JSON.stringify({
          ref: `refs/heads/${branch}`,
          sha: refData.object.sha,
        }),
      });

      return NextResponse.json({ ok: true, data });
    }

    if (action === "create_pr") {
      const data = await githubFetch(`/repos/${owner}/${repo}/pulls`, {
        method: "POST",
        body: JSON.stringify({
          title: body.title,
          head: body.head,
          base: body.base || "main",
          body: body.body || "",
        }),
      });

      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json(
      { ok: false, error: "Unknown GitHub action." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

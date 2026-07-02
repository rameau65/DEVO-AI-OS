import { NextRequest, NextResponse } from "next/server";
import { getGitHubConfig, getOctokit, encodeBase64, decodeBase64 } from "@/lib/github";
import { requireSecret } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    requireSecret(req, "GITHUB_API_SECRET");
    return NextResponse.json({ ok: true, message: "DEVO-AI-OS GitHub API is running.", actions: ["repo_info", "list_files", "read_file", "create_branch", "write_file", "delete_file", "create_pr", "refactor_commit_pr"] });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireSecret(req, "GITHUB_API_SECRET");
    const octokit = getOctokit();
    const config = getGitHubConfig();
    const body = await req.json();
    const action = body.action;
    const owner = body.owner || config.owner;
    const repo = body.repo || config.repo;
    const defaultBranch = body.defaultBranch || config.defaultBranch;
    const branch = body.branch || defaultBranch;

    if (action === "repo_info") {
      const { data } = await octokit.repos.get({ owner, repo });
      return NextResponse.json({ ok: true, repo: { full_name: data.full_name, default_branch: data.default_branch, html_url: data.html_url } });
    }

    if (action === "read_file") {
      const { data } = await octokit.repos.getContent({ owner, repo, path: body.path, ref: branch });
      if (Array.isArray(data) || data.type !== "file") throw new Error("Path is not a file.");
      return NextResponse.json({ ok: true, path: body.path, branch, sha: data.sha, content: decodeBase64(data.content || "") });
    }

    if (action === "list_files") {
      const { data } = await octokit.repos.getContent({ owner, repo, path: body.path || "", ref: branch });
      return NextResponse.json({ ok: true, data });
    }

    if (action === "create_branch") {
      const newBranch = body.newBranch || body.branch;
      const baseBranch = body.baseBranch || defaultBranch;
      const { data: baseRef } = await octokit.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
      const { data } = await octokit.git.createRef({ owner, repo, ref: `refs/heads/${newBranch}`, sha: baseRef.object.sha });
      return NextResponse.json({ ok: true, branch: newBranch, data });
    }

    if (action === "write_file") {
      let sha: string | undefined;
      try {
        const { data: existing } = await octokit.repos.getContent({ owner, repo, path: body.path, ref: branch });
        if (!Array.isArray(existing) && existing.type === "file") sha = existing.sha;
      } catch {}
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner, repo, path: body.path, message: body.message || `Update ${body.path}`, content: encodeBase64(body.content), branch, sha
      });
      return NextResponse.json({ ok: true, commit: data.commit, content: data.content });
    }

    if (action === "create_pr") {
      const { data } = await octokit.pulls.create({ owner, repo, title: body.title, head: body.head || branch, base: body.base || defaultBranch, body: body.body || "" });
      return NextResponse.json({ ok: true, pull_request: { number: data.number, title: data.title, html_url: data.html_url, state: data.state } });
    }

    if (action === "refactor_commit_pr") {
      const newBranch = body.newBranch || `feature/${body.taskName || "devo-update"}`;
      const baseBranch = body.baseBranch || defaultBranch;
      const files = body.files || [];

      try {
        const { data: baseRef } = await octokit.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
        await octokit.git.createRef({ owner, repo, ref: `refs/heads/${newBranch}`, sha: baseRef.object.sha });
      } catch (error: any) {
        if (!String(error.message).includes("Reference already exists")) throw error;
      }

      const commits = [];
      for (const file of files) {
        let sha: string | undefined;
        try {
          const { data: existing } = await octokit.repos.getContent({ owner, repo, path: file.path, ref: newBranch });
          if (!Array.isArray(existing) && existing.type === "file") sha = existing.sha;
        } catch {}
        const { data } = await octokit.repos.createOrUpdateFileContents({
          owner, repo, path: file.path, message: file.message || `Update ${file.path}`, content: encodeBase64(file.content), branch: newBranch, sha
        });
        commits.push({ path: file.path, commitSha: data.commit.sha });
      }

      const { data: pr } = await octokit.pulls.create({ owner, repo, title: body.prTitle || "DEVO-AI-OS update", head: newBranch, base: baseBranch, body: body.prBody || "" });
      return NextResponse.json({ ok: true, branch: newBranch, commits, pull_request: { number: pr.number, html_url: pr.html_url, state: pr.state } });
    }

    return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: error.message?.startsWith("Unauthorized") ? 401 : 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getGitHubConfig,
  getOctokit,
  requireApiSecret,
  encodeBase64,
  decodeBase64
} from "@/lib/github";

export async function GET(req: NextRequest) {
  try {
    requireApiSecret(req, "GITHUB_API_SECRET");
    return NextResponse.json({
      ok: true,
      message: "DEVO-AI-OS GitHub API is running.",
      actions: [
        "repo_info",
        "list_files",
        "read_file",
        "create_branch",
        "write_file",
        "delete_file",
        "create_pr",
        "refactor_commit_pr"
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireApiSecret(req, "GITHUB_API_SECRET");

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
      return NextResponse.json({
        ok: true,
        repo: {
          full_name: data.full_name,
          default_branch: data.default_branch,
          private: data.private,
          html_url: data.html_url
        }
      });
    }

    if (action === "list_files") {
      const path = body.path || "";
      const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
      return NextResponse.json({ ok: true, path, branch, data });
    }

    if (action === "read_file") {
      const path = body.path;
      if (!path) throw new Error("Missing path.");

      const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
      if (Array.isArray(data) || data.type !== "file") throw new Error("Path is not a file.");

      return NextResponse.json({
        ok: true,
        path,
        branch,
        sha: data.sha,
        content: decodeBase64(data.content || "")
      });
    }

    if (action === "create_branch") {
      const newBranch = body.newBranch || body.branch;
      const baseBranch = body.baseBranch || defaultBranch;
      if (!newBranch) throw new Error("Missing newBranch.");

      const { data: baseRef } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${baseBranch}`
      });

      const { data } = await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha: baseRef.object.sha
      });

      return NextResponse.json({ ok: true, action, branch: newBranch, baseBranch, data });
    }

    if (action === "write_file") {
      const path = body.path;
      const content = body.content;
      const message = body.message || `Update ${path}`;
      if (!path) throw new Error("Missing path.");
      if (typeof content !== "string") throw new Error("Missing content.");

      let sha: string | undefined;

      try {
        const { data: existing } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        if (!Array.isArray(existing) && existing.type === "file") sha = existing.sha;
      } catch {
        sha = undefined;
      }

      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: encodeBase64(content),
        branch,
        sha
      });

      return NextResponse.json({ ok: true, action, path, branch, commit: data.commit, content: data.content });
    }

    if (action === "delete_file") {
      const path = body.path;
      const message = body.message || `Delete ${path}`;
      if (!path) throw new Error("Missing path.");

      const { data: existing } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
      if (Array.isArray(existing) || existing.type !== "file") throw new Error("Path is not a file.");

      const { data } = await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha: existing.sha,
        branch
      });

      return NextResponse.json({ ok: true, action, path, branch, commit: data.commit });
    }

    if (action === "create_pr") {
      const title = body.title;
      const head = body.head || branch;
      const base = body.base || defaultBranch;
      const prBody = body.body || "";
      if (!title) throw new Error("Missing title.");

      const { data } = await octokit.pulls.create({ owner, repo, title, head, base, body: prBody });

      return NextResponse.json({
        ok: true,
        action,
        pull_request: {
          number: data.number,
          title: data.title,
          html_url: data.html_url,
          state: data.state
        }
      });
    }

    if (action === "refactor_commit_pr") {
      const taskName = body.taskName || "devo-update";
      const newBranch = body.newBranch || `feature/${taskName}`;
      const baseBranch = body.baseBranch || defaultBranch;
      const files = body.files || [];
      const prTitle = body.prTitle || `DEVO-AI-OS: ${taskName}`;
      const prBody = body.prBody || "Automated DEVO-AI-OS update.";

      if (!Array.isArray(files) || files.length === 0) throw new Error("Missing files array.");

      try {
        const { data: baseRef } = await octokit.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
        await octokit.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${newBranch}`,
          sha: baseRef.object.sha
        });
      } catch (error: any) {
        if (!String(error.message).includes("Reference already exists")) throw error;
      }

      const commits = [];
      for (const file of files) {
        const path = file.path;
        const content = file.content;
        const message = file.message || `Update ${path}`;
        if (!path || typeof content !== "string") throw new Error("Each file requires path and content.");

        let sha: string | undefined;
        try {
          const { data: existing } = await octokit.repos.getContent({ owner, repo, path, ref: newBranch });
          if (!Array.isArray(existing) && existing.type === "file") sha = existing.sha;
        } catch {
          sha = undefined;
        }

        const { data } = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content: encodeBase64(content),
          branch: newBranch,
          sha
        });

        commits.push({ path, commitSha: data.commit.sha, html_url: data.commit.html_url });
      }

      const { data: pr } = await octokit.pulls.create({
        owner,
        repo,
        title: prTitle,
        head: newBranch,
        base: baseBranch,
        body: prBody
      });

      return NextResponse.json({
        ok: true,
        action,
        branch: newBranch,
        baseBranch,
        commits,
        pull_request: {
          number: pr.number,
          title: pr.title,
          html_url: pr.html_url,
          state: pr.state
        }
      });
    }

    return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
  } catch (error: any) {
    const message = error.message || "Unknown error";
    const status = message.startsWith("Unauthorized") ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

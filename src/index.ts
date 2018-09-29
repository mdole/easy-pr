import * as OctoKit from "@octokit/rest"
import { filepathContentsMapToUpdateGitHubBranch } from "memfs-or-file-map-to-github-branch"

export async function handler(event, context) {
  await makeAPR()
  return { hello: "world" }
}

const makeAPR = async () => {
  const settings = {
    owner: "artsy",
    repo: "artsy.github.io",
    fullBranchReference:
      "heads/auto_" +
      Math.random()
        .toString(36)
        .substring(7),
    message: "Adds a new blog post",
  }

  const token = process.env.DANGER_GITHUB_API_TOKEN || process.env.GITHUB_API_TOKEN
  if (!token) {
    throw new Error("No API token set up for this function")
  }

  const octokit = new OctoKit()
  octokit.authenticate({
    type: "token",
    token,
  })

  const fileMap = {
    "README.md": "hello, world",
  }

  await filepathContentsMapToUpdateGitHubBranch(octokit, fileMap, settings)
}

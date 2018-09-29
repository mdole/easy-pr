import * as OctoKit from "@octokit/rest"
import { filepathContentsMapToUpdateGitHubBranch } from "memfs-or-file-map-to-github-branch"
import fetch from "node-fetch"

export async function handler(event, context) {
  await makeAPR()
  return { hello: "world" }
}

const makeAPR = async () => {
  const branch =
    "auto_" +
    Math.random()
      .toString(36)
      .substring(7)

  const settings = {
    owner: "artsy",
    repo: "artsy.github.io",
    fullBaseBranch: "heads/source",
    fullBranchReference: `heads/${branch}`,
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

  const fortune = await generateFortune()
  const deathStory = generateDeathStory(fortune)

  const fileMap: any = {}
  const now = new Date()
  const filenameSafeFortune = fortune
    .replace(/\s+/g, "-")
    .replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, "")
    .toLowerCase()
  const filename = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${filenameSafeFortune}`
  fileMap[filename] = deathStory

  await filepathContentsMapToUpdateGitHubBranch(octokit, fileMap, settings)

  await octokit.pullRequests.create({
    base: "source",
    head: branch,
    owner: "artsy",
    repo: "artsy.github.io",
    title: fortune,
  })
}

function generateDeathStory(fortune: string) {
  const deathString = `
  Hello to you, my past self.

  I'm writing this blog post in year ${generateYear()} from a jail
  in ${generateCountry()}. Having regrettably just crossed paths
  with ${generateCelebrity()}, I am now almost surely in my last
  moments of life. I know you never thought your life would end up
  like this...but even so, always remember: ${fortune}`
  return deathString
}

// Generates a random year of death (always within 40 years of current year).
function generateYear() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const randomYear = Math.floor(Math.random() * 40) + currentYear
  return randomYear
}

// Generates a country randomly picked from the included, static, array.
function generateCountry() {
  const countryListArray = ["Canada", "Russia", "Ukraine", "Sweden"]
  return countryListArray[Math.floor(Math.random() * countryListArray.length)]
}

// Generates a celebrity randomly picked from the included, static, array.
function generateCelebrity() {
  const celebrityListArray = ["Kim Kardashian", "Cher", "Ariana Grande", "Leonardo DiCaprio", "Matt Dole"]
  return celebrityListArray[Math.floor(Math.random() * celebrityListArray.length)]
}

// Generates a fortune grabbed from a fortune-telling API.
async function generateFortune(): Promise<string> {
  const fortuneAPIURL = `http://yerkee.com/api/fortune`
  const response = await fetch(fortuneAPIURL)
  const json = await response.json()
  return json.fortune
}

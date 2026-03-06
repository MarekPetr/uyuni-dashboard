import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type {
  Comment,
  Issue,
  IssueSearchParams,
  Label,
  PaginatedResponse,
  PaginationInfo,
  Project,
  PullRequest,
  PullRequestSearchParams,
  Repository,
} from './types'

const OWNER = 'uyuni-project'
const REPO = 'uyuni'

export function parseLinkHeader(header: string | null): PaginationInfo {
  const info: PaginationInfo = {
    nextPage: null,
    prevPage: null,
    lastPage: null,
    firstPage: null,
  }

  if (!header) return info

  const links = header.split(',')
  for (const link of links) {
    const match = link.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="(\w+)"/)
    if (match) {
      const page = parseInt(match[1], 10)
      const rel = match[2]
      if (rel === 'next') info.nextPage = page
      else if (rel === 'prev') info.prevPage = page
      else if (rel === 'last') info.lastPage = page
      else if (rel === 'first') info.firstPage = page
    }
  }

  return info
}

function createGitHubClient(): AxiosInstance {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

  const client = axios.create({
    baseURL: `https://api.github.com/repos/${OWNER}/${REPO}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  return client
}

const github = createGitHubClient()

export async function getRepository(): Promise<Repository> {
  const { data } = await github.get<Repository>('')
  return data
}

export async function getIssues(
  params: IssueSearchParams = {},
): Promise<PaginatedResponse<Issue>> {
  const response = await github.get<Array<Issue>>('/issues', {
    params: {
      state: params.state ?? 'open',
      sort: params.sort ?? 'created',
      direction: params.direction ?? 'desc',
      per_page: params.per_page ?? 30,
      page: params.page ?? 1,
    },
  })

  // GitHub REST API returns PRs mixed with issues — filter them out
  const issues = response.data.filter((item) => !item.pull_request)
  const pagination = parseLinkHeader(response.headers.link ?? null)

  return { data: issues, pagination }
}

export async function getIssue(number: number): Promise<Issue> {
  const { data } = await github.get<Issue>(`/issues/${number}`)
  return data
}

export async function getIssueComments(
  number: number,
  page = 1,
  perPage = 30,
): Promise<PaginatedResponse<Comment>> {
  const response = await github.get<Array<Comment>>(
    `/issues/${number}/comments`,
    {
      params: { page, per_page: perPage },
    },
  )
  const pagination = parseLinkHeader(response.headers.link ?? null)
  return { data: response.data, pagination }
}

export async function getPullRequests(
  params: PullRequestSearchParams = {},
): Promise<PaginatedResponse<PullRequest>> {
  const response = await github.get<Array<PullRequest>>('/pulls', {
    params: {
      state: params.state ?? 'open',
      sort: params.sort ?? 'created',
      direction: params.direction ?? 'desc',
      per_page: params.per_page ?? 30,
      page: params.page ?? 1,
    },
  })

  const pagination = parseLinkHeader(response.headers.link ?? null)
  return { data: response.data, pagination }
}

export async function getPullRequest(number: number): Promise<PullRequest> {
  const { data } = await github.get<PullRequest>(`/pulls/${number}`)
  return data
}

export async function getLabels(
  page = 1,
  perPage = 100,
): Promise<PaginatedResponse<Label>> {
  const response = await github.get<Array<Label>>('/labels', {
    params: { page, per_page: perPage },
  })
  const pagination = parseLinkHeader(response.headers.link ?? null)
  return { data: response.data, pagination }
}

export async function getProjects(): Promise<Array<Project>> {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
  if (!token) {
    throw new Error(
      'A GitHub token is required to fetch projects (GraphQL API).',
    )
  }

  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        projectsV2(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id
            title
            shortDescription
            url
            closed
            createdAt
            updatedAt
            creator {
              login
            }
          }
        }
      }
    }
  `

  const response = await axios.post(
    'https://api.github.com/graphql',
    { query, variables: { owner: OWNER, repo: REPO } },
    { headers: { Authorization: `Bearer ${token}` } },
  )

  const nodes: Array<Project> =
    response.data?.data?.repository?.projectsV2?.nodes ?? []
  return nodes.filter((p) => !p.closed)
}

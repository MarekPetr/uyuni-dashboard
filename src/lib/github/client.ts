import axios from 'axios'
import type {
  Issue,
  IssueComment,
  IssueSearchParams,
  Label,
  Languages,
  PaginatedResponse,
  PaginationInfo,
  Project,
  PullRequest,
  PullRequestSearchParams,
  Repository,
} from '@/lib/github/types'
import { getToken } from '@/lib/github/token-storage'

export const OWNER = 'uyuni-project'
export const REPO = 'uyuni'

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

const github = axios.create({
  baseURL: `https://api.github.com/repos/${OWNER}/${REPO}`,
  headers: {
    Accept: 'application/vnd.github+json',
  },
})

github.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
): Promise<PaginatedResponse<IssueComment>> {
  const response = await github.get<Array<IssueComment>>(
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

type SearchResponse = {
  total_count: number
}

async function getLabelsCountWithToken(): Promise<number> {
  const { data: repo } = await github.get<Repository>('')

  const response = await github.get<SearchResponse>(
    'https://api.github.com/search/labels',
    {
      params: {
        repository_id: repo.id,
        q: `repo:${OWNER}/${REPO}`,
        per_page: 1,
      },
    },
  )

  return response.data.total_count
}

async function getLabelsCountWithoutToken(): Promise<number> {
  let count = 0
  let page = 1
  let hasNext = true

  while (hasNext) {
    const { data, pagination } = await getLabels(page, 100)
    count += data.length
    hasNext = !!pagination.nextPage
    page++
  }

  return count
}

export async function getLabelsCount(): Promise<number> {
  return getToken() ? getLabelsCountWithToken() : getLabelsCountWithoutToken()
}

export async function getSearchCount(
  type: 'issue' | 'pr',
  state: 'open' | 'closed',
): Promise<number> {
  const response = await github.get<SearchResponse>(
    'https://api.github.com/search/issues',
    {
      params: {
        q: `repo:${OWNER}/${REPO} type:${type} state:${state}`,
        per_page: 1,
      },
    },
  )
  return response.data.total_count
}

export async function getLanguages(): Promise<Languages> {
  const { data } = await github.get<Languages>('/languages')
  return data
}

export async function getProjects(
  page = 1,
  perPage = 30,
): Promise<PaginatedResponse<Project>> {
  const response = await github.get<Array<Project>>(
    `https://api.github.com/orgs/${OWNER}/projectsV2`,
    {
      params: { per_page: perPage, page },
    },
  )
  const pagination = parseLinkHeader(response.headers.link ?? null)
  return {
    data: response.data.filter((project) => !project.closed_at),
    pagination,
  }
}

export async function getProjectsCount(): Promise<number> {
  let count = 0
  let page = 1
  let hasNext = true

  while (hasNext) {
    const { data, pagination } = await getProjects(page, 100)
    count += data.length
    hasNext = !!pagination.nextPage
    page++
  }

  return count
}

export function createProjectUrl(projectNumber: number) {
  return `https://github.com/orgs/${OWNER}/projects/${projectNumber}`
}

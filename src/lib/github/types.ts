export interface GitHubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  html_url: string
  gravatar_id: string
  type: 'User' | 'Organization' | 'Bot'
  site_admin: boolean
}

export interface Label {
  id: number
  node_id: string
  name: string
  color: string
  description: string | null
  default: boolean
}

export interface Milestone {
  id: number
  node_id: string
  number: number
  title: string
  description: string | null
  state: 'open' | 'closed'
  open_issues: number
  closed_issues: number
  created_at: string
  updated_at: string
  due_on: string | null
  closed_at: string | null
}

export interface Issue {
  id: number
  node_id: string
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  locked: boolean
  user: GitHubUser
  labels: Array<Label>
  assignee: GitHubUser | null
  assignees: Array<GitHubUser>
  milestone: Milestone | null
  comments: number
  created_at: string
  updated_at: string
  closed_at: string | null
  html_url: string
  author_association: string
  /** Present only when the issue is actually a pull request */
  pull_request?: {
    url: string
    html_url: string
    diff_url: string
    patch_url: string
  }
}

export interface PullRequest {
  id: number
  node_id: string
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  locked: boolean
  user: GitHubUser
  labels: Array<Label>
  assignee: GitHubUser | null
  assignees: Array<GitHubUser>
  milestone: Milestone | null
  comments: number
  created_at: string
  updated_at: string
  closed_at: string | null
  merged_at: string | null
  merge_commit_sha: string | null
  html_url: string
  diff_url: string
  patch_url: string
  draft: boolean
  author_association: string
  head: {
    label: string
    ref: string
    sha: string
    user: GitHubUser
    repo: Repository | null
  }
  base: {
    label: string
    ref: string
    sha: string
    user: GitHubUser
    repo: Repository
  }
}

export interface Repository {
  id: number
  node_id: string
  name: string
  full_name: string
  description: string | null
  homepage: string | null
  html_url: string
  clone_url: string
  language: string | null
  default_branch: string
  fork: boolean
  forks_count: number
  stargazers_count: number
  watchers_count: number
  open_issues_count: number
  open_issues: number
  size: number
  topics: Array<string>
  archived: boolean
  disabled: boolean
  private: boolean
  has_issues: boolean
  has_wiki: boolean
  has_pages: boolean
  has_projects: boolean
  has_discussions: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  owner: GitHubUser
  license: {
    key: string
    name: string
    spdx_id: string
    url: string | null
  } | null
}

export interface Project {
  id: string
  title: string
  shortDescription: string | null
  url: string
  closed: boolean
  createdAt: string
  updatedAt: string
  creator: {
    login: string
  }
}

export interface Comment {
  id: number
  node_id: string
  body: string
  user: GitHubUser
  created_at: string
  updated_at: string
  html_url: string
  author_association: string
}

/** Parsed pagination info from the GitHub Link header */
export interface PaginationInfo {
  nextPage: number | null
  prevPage: number | null
  lastPage: number | null
  firstPage: number | null
}

export interface PaginatedResponse<T> {
  data: Array<T>
  pagination: PaginationInfo
}

export interface IssueSearchParams {
  state?: 'open' | 'closed' | 'all'
  sort?: 'created' | 'updated' | 'comments'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface PullRequestSearchParams {
  state?: 'open' | 'closed' | 'all'
  sort?: 'created' | 'updated' | 'popularity' | 'long-running'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

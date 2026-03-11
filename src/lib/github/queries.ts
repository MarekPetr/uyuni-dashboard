import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { fiveMinutesInMs, oneMinuteInMs } from '../utils'
import type { InfiniteData, QueryKey } from '@tanstack/react-query'
import type {
  Issue,
  IssueComment,
  IssueSearchParams,
  Label,
  Languages,
  PaginatedResponse,
  Project,
  PullRequest,
  PullRequestSearchParams,
  Repository,
} from '@/lib/github/types'
import type { AxiosError } from 'axios'
import {
  getIssue,
  getIssueComments,
  getIssues,
  getLabels,
  getLabelsCount,
  getLanguages,
  getProjects,
  getProjectsCount,
  getPullRequest,
  getPullRequests,
  getRepository,
  getSearchCount,
} from '@/lib/github/client'

export const repositoryQueryOptions = () =>
  queryOptions<Repository, AxiosError>({
    queryKey: ['repository'],
    queryFn: getRepository,
    staleTime: fiveMinutesInMs,
  })

export const issuesInfiniteQueryOptions = (
  params: Omit<IssueSearchParams, 'page' | 'per_page'> = {},
) =>
  infiniteQueryOptions<
    PaginatedResponse<Issue>,
    AxiosError,
    InfiniteData<PaginatedResponse<Issue>>,
    QueryKey,
    number
  >({
    queryKey: ['issues', params],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getIssues({ ...params, page: pageParam, per_page: 30 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
  })

export const issueQueryOptions = (number: number) =>
  queryOptions<Issue, AxiosError>({
    queryKey: ['issue', number],
    queryFn: () => getIssue(number),
    staleTime: fiveMinutesInMs,
  })

export const issueCommentsInfiniteQueryOptions = (issueNumber: number) =>
  infiniteQueryOptions<
    PaginatedResponse<IssueComment>,
    AxiosError,
    InfiniteData<PaginatedResponse<IssueComment>>,
    QueryKey,
    number
  >({
    queryKey: ['issueComments', issueNumber],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getIssueComments(issueNumber, pageParam, 30),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: oneMinuteInMs,
  })

export const pullRequestsInfiniteQueryOptions = (
  params: Omit<PullRequestSearchParams, 'page' | 'per_page'> = {},
) =>
  infiniteQueryOptions<
    PaginatedResponse<PullRequest>,
    AxiosError,
    InfiniteData<PaginatedResponse<PullRequest>>,
    QueryKey,
    number
  >({
    queryKey: ['pullRequests', params],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getPullRequests({ ...params, page: pageParam, per_page: 30 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: oneMinuteInMs,
  })

export const pullRequestQueryOptions = (number: number) =>
  queryOptions<PullRequest, AxiosError>({
    queryKey: ['pullRequest', number],
    queryFn: () => getPullRequest(number),
    staleTime: oneMinuteInMs,
  })

export const labelsQueryOptions = () =>
  infiniteQueryOptions<
    PaginatedResponse<Label>,
    AxiosError,
    InfiniteData<PaginatedResponse<Label>>,
    QueryKey,
    number
  >({
    queryKey: ['labels'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLabels(pageParam, 100),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: fiveMinutesInMs,
  })

export const labelsCountQueryOptions = () =>
  queryOptions<number, AxiosError>({
    queryKey: ['labelsCount'],
    queryFn: getLabelsCount,
    staleTime: fiveMinutesInMs,
  })

export const languagesQueryOptions = () =>
  queryOptions<Languages, AxiosError>({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: fiveMinutesInMs,
  })

export const searchCountQueryOptions = (
  type: 'issue' | 'pr',
  state: 'open' | 'closed',
) =>
  queryOptions<number, AxiosError>({
    queryKey: ['searchCount', type, state],
    queryFn: () => getSearchCount(type, state),
    staleTime: fiveMinutesInMs,
  })

export const projectsQueryOptions = () =>
  infiniteQueryOptions<
    PaginatedResponse<Project>,
    AxiosError,
    InfiniteData<PaginatedResponse<Project>>,
    QueryKey,
    number
  >({
    queryKey: ['projects'],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getProjects(pageParam, 30),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: fiveMinutesInMs,
  })

export const projectsCountQueryOptions = () =>
  queryOptions<number, AxiosError>({
    queryKey: ['projectsCount'],
    queryFn: getProjectsCount,
    staleTime: fiveMinutesInMs,
  })

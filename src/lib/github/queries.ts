import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { fiveMinutesInMs, oneMinuteInMs } from '../utils'
import type {
  IssueSearchParams,
  PullRequestSearchParams,
} from '@/lib/github/types'
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
  queryOptions({
    queryKey: ['repository'],
    queryFn: getRepository,
    staleTime: fiveMinutesInMs,
  })

export const issuesInfiniteQueryOptions = (
  params: Omit<IssueSearchParams, 'page' | 'per_page'> = {},
) =>
  infiniteQueryOptions({
    queryKey: ['issues', params],
    queryFn: ({ pageParam }) =>
      getIssues({ ...params, page: pageParam, per_page: 30 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
  })

export const issueQueryOptions = (number: number) =>
  queryOptions({
    queryKey: ['issue', number],
    queryFn: () => getIssue(number),
    staleTime: fiveMinutesInMs,
  })

export const issueCommentsInfiniteQueryOptions = (issueNumber: number) =>
  infiniteQueryOptions({
    queryKey: ['issueComments', issueNumber],
    queryFn: ({ pageParam }) => getIssueComments(issueNumber, pageParam, 30),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: oneMinuteInMs,
  })

export const pullRequestsInfiniteQueryOptions = (
  params: Omit<PullRequestSearchParams, 'page' | 'per_page'> = {},
) =>
  infiniteQueryOptions({
    queryKey: ['pullRequests', params],
    queryFn: ({ pageParam }) =>
      getPullRequests({ ...params, page: pageParam, per_page: 30 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: oneMinuteInMs,
  })

export const pullRequestQueryOptions = (number: number) =>
  queryOptions({
    queryKey: ['pullRequest', number],
    queryFn: () => getPullRequest(number),
    staleTime: oneMinuteInMs,
  })

export const labelsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ['labels'],
    queryFn: ({ pageParam }) => getLabels(pageParam, 100),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: fiveMinutesInMs,
  })

export const labelsCountQueryOptions = () =>
  queryOptions({
    queryKey: ['labelsCount'],
    queryFn: getLabelsCount,
    staleTime: fiveMinutesInMs,
  })

export const languagesQueryOptions = () =>
  queryOptions({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: fiveMinutesInMs,
  })

export const searchCountQueryOptions = (
  type: 'issue' | 'pr',
  state: 'open' | 'closed',
) =>
  queryOptions({
    queryKey: ['searchCount', type, state],
    queryFn: () => getSearchCount(type, state),
    staleTime: fiveMinutesInMs,
  })

export const projectsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => getProjects(pageParam, 30),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    staleTime: fiveMinutesInMs,
  })

export const projectsCountQueryOptions = () =>
  queryOptions({
    queryKey: ['projectsCount'],
    queryFn: getProjectsCount,
    staleTime: fiveMinutesInMs,
  })

import {
  queryOptions,
  infiniteQueryOptions,
} from '@tanstack/react-query'
import {
  getRepository,
  getIssues,
  getIssue,
  getIssueComments,
  getPullRequests,
  getPullRequest,
  getLabels,
  getProjects,
} from './client'
import type { IssueSearchParams, PullRequestSearchParams } from './types'

export const repositoryQueryOptions = () =>
  queryOptions({
    queryKey: ['repository'],
    queryFn: getRepository,
    staleTime: 5 * 60 * 1000,
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
  })

export const issueCommentsInfiniteQueryOptions = (issueNumber: number) =>
  infiniteQueryOptions({
    queryKey: ['issueComments', issueNumber],
    queryFn: ({ pageParam }) =>
      getIssueComments(issueNumber, pageParam, 30),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
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
  })

export const pullRequestQueryOptions = (number: number) =>
  queryOptions({
    queryKey: ['pullRequest', number],
    queryFn: () => getPullRequest(number),
  })

export const labelsQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: ['labels'],
    queryFn: ({ pageParam }) => getLabels(pageParam, 100),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
  })

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000,
  })

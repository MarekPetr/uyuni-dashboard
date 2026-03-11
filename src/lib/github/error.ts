import type { AxiosError } from 'axios'

export const RATE_LIMITS_EXCEEDED_MESSAGE =
  'GitHub API rate limit may be exceeded. Set GitHub Token in the sidebar to increase your limit.'
export const GENERAL_ERROR_MESSAGE = 'Failed to load data'

export const getErrorMessage = (error: AxiosError | null) => {
  return error?.status === 403
    ? RATE_LIMITS_EXCEEDED_MESSAGE
    : GENERAL_ERROR_MESSAGE
}

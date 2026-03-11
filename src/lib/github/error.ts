import type { AxiosError } from 'axios'

export const RATE_LIMITS_EXCEEDED_MESSAGE =
  'GitHub API rate limit may be exceeded. Set GitHub Token in the sidebar to increase your limit.'
export const GENERIC_ERROR_MESSAGE = 'Some error occured.'

export const getErrorMessage = (error: AxiosError | null) => {
  return error?.status === 403
    ? RATE_LIMITS_EXCEEDED_MESSAGE
    : GENERIC_ERROR_MESSAGE
}

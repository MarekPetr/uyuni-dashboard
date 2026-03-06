import { describe, expect, it } from 'vitest'
import { parseLinkHeader } from '../lib/github/client'

describe('parseLinkHeader', () => {
  it('returns all nulls for null input', () => {
    const result = parseLinkHeader(null)
    expect(result).toEqual({
      nextPage: null,
      prevPage: null,
      lastPage: null,
      firstPage: null,
    })
  })

  it('returns all nulls for empty string', () => {
    const result = parseLinkHeader('')
    expect(result).toEqual({
      nextPage: null,
      prevPage: null,
      lastPage: null,
      firstPage: null,
    })
  })

  it('parses a full Link header with all rels', () => {
    const header =
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?page=2>; rel="next", ' +
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?page=10>; rel="last", ' +
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?page=1>; rel="first", ' +
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?page=1>; rel="prev"'

    const result = parseLinkHeader(header)
    expect(result).toEqual({
      nextPage: 2,
      lastPage: 10,
      firstPage: 1,
      prevPage: 1,
    })
  })

  it('parses a Link header with only next and last', () => {
    const header =
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?state=open&page=2>; rel="next", ' +
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?state=open&page=5>; rel="last"'

    const result = parseLinkHeader(header)
    expect(result).toEqual({
      nextPage: 2,
      lastPage: 5,
      firstPage: null,
      prevPage: null,
    })
  })

  it('parses a Link header with only prev and first (last page)', () => {
    const header =
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?page=4>; rel="prev", ' +
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?page=1>; rel="first"'

    const result = parseLinkHeader(header)
    expect(result).toEqual({
      nextPage: null,
      lastPage: null,
      firstPage: 1,
      prevPage: 4,
    })
  })

  it('handles URLs with multiple query parameters', () => {
    const header =
      '<https://api.github.com/repos/uyuni-project/uyuni/issues?state=closed&sort=updated&direction=desc&per_page=30&page=3>; rel="next"'

    const result = parseLinkHeader(header)
    expect(result.nextPage).toBe(3)
  })
})

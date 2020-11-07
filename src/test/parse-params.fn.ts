import queryString, { ParsedUrlQuery } from 'querystring'

export function parseParams(url: string): ParsedUrlQuery {
	return queryString.parse(url.split('?').pop()!)
}

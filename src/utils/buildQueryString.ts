/** A single query parameter as list views hand it over: `page` is a number. */
export type QueryParamValue = string | number | null | undefined;

export type QueryParams = Record<string, QueryParamValue>;

type PresentEntry = [string, string | number];

/**
 * Empty values are dropped instead of sent as `key=`: the API treats an empty
 * filter as "no filter", so clearing a select must not narrow the results.
 */
const isPresentEntry = (entry: [string, QueryParamValue]): entry is PresentEntry => {
  const [, value] = entry;
  return value !== '' && value !== null && value !== undefined;
};

/**
 * Builds the query string for the list endpoints, without a leading `?`.
 *
 * Both key and value are percent-encoded: user typed text reaches these filters
 * (e.g. searching `María & Co`) and an unescaped `&` or `=` would split the
 * query into bogus parameters and silently break the search.
 *
 * `encodeURIComponent` is preferred over `URLSearchParams` because the latter
 * serialises spaces as `+` (form encoding) instead of `%20`. Key order follows
 * the insertion order of `params`.
 */
export const buildQueryString = (params: QueryParams): string => Object.entries(params)
  .filter(isPresentEntry)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');

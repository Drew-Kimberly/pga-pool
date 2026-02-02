Pagination

Overview
List endpoints accept a `page` query object that controls page size and page number.
If no pagination is provided, defaults are applied per endpoint (typically size 100, max 250).

Request Parameters
- page[size]: The number of items per page (positive integer).
- page[number]: The page number (1-based positive integer).

Defaults and Limits
- page[number] defaults to 1 if omitted.
- page[size] defaults to the endpoint's configured default page size.
- page[size] is capped at the endpoint's configured maximum.

Response Metadata
List responses include a `meta` object with pagination details:
- requested_size: The requested page size.
- actual_size: The number of items returned in the page.
- number: The current page number (1-based).
- total: Total matching items (when available).

Examples
Fetch the first 50 items:
`GET /pga-tournaments?page[size]=50&page[number]=1`

Fetch page 3 with a smaller page size:
`GET /pga-tournaments?page[size]=25&page[number]=3`

Filtering

Overview
List endpoints accept a `filter` query object. Each filter key is a field name, and dot-notation
can be used to target nested fields (for example, `date.year`).

Query Syntax
Use the following notation:
- `filter[FIELD][OPERATION]=VALUE`

Examples:
- `filter[name][contains]=open`
- `filter[date.year][gte]=2025`
- `filter[start_date][lt]=2025-01-01T00:00:00Z`

Operator Omission
If the operation is omitted, it is treated as `eq` (exact match):
- `filter[active]=true` -> `eq`
- `filter[year]=2025` -> `eq`
- `filter[name]=Masters` -> `eq`

Important: timestamps do not support `eq` or `neq`. For timestamp fields, omitting the operation
results in a 400 error.

Supported Operators by Type
String fields:
- eq, neq, contains

Number fields:
- eq, neq, gt, gte, lt, lte

Boolean fields:
- eq, neq

Enum and UUID fields:
- eq, neq

Timestamp fields (ISO-8601 strings):
- gt, gte, lt, lte

Multiple Operators
You can apply multiple operators to the same field by repeating the operator:
- `filter[score][gte]=10&filter[score][lt]=20`

Nested Fields
Dot-notation is the only supported way to target nested fields:
- `filter[date.year][gte]=2025`
- `filter[date.start][gte]=2025-01-01T00:00:00Z`

Nested bracket objects are not supported (and will return 400):
- `filter[date][year][gte]=2025`

Notes
- Unknown filter keys are rejected (400).
- Values are parsed according to the field type. For example, numeric filters accept numeric
  values and boolean filters accept true/false.

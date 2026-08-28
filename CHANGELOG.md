# Changelog

## 1.1.0

- `useRouteQuery` accepts a `replace` option. When set, `setQuery` and `setQueryParam` call
  `router.replace()` instead of `router.push()`, so keeping filters in the URL no longer adds a
  history entry per change. Defaults to `push`, so existing callers are unaffected.

## 1.0.0

Version 1.0 🎉

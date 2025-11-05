Automatic optimistic update is convenient, but there might be cases where you want to explicitly control how the update happens. You can use the `optimisticUpdateProvider` callback to fully customize how each query cache entry should be optimistically updated. When the callback is set, it takes precedence over the automatic optimistic logic.

```ts
client.post.useCreate({
  optimisticUpdateProvider: ({ queryModel, queryOperation, queryArgs, currentData, mutationArgs }) => {
    return { kind: 'Update', data: ... /* computed result */ };
  }
});
```

The callback is invoked for each query cache entry and receives the following arguments in a property bag:

- `queryModel`: The model of the query, e.g., `Post`.
- `queryOperation`: The operation of the query, e.g., `findMany`, `count`.
- `queryArgs`: The arguments of the query, e.g., `{ where: { published: true } }`.
- `currentData`: The current cache data.
- `mutationArgs`: The arguments of the mutation, e.g., `{ data: { title: 'My awesome post' } }`.

It should return a result object with the following fields:

- `kind`: The kind of the optimistic update.
    - `Update`: update the cache using the computed data
    - `Skip`: skip the update
    - `ProceedDefault`: use the default automatic optimistic behavior.
- `data`: The computed data to update the cache with. Only used when `kind` is `Update`.

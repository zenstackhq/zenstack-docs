- `select`

    An object specifying the fields to include in the result. Setting a field to `true` means to include it. If a field is a relation, you can provide an nested object to further specify which fields of the relation to include.

    This field is optional. If not provided, all non-relation fields are included by default. The `include` field is mutually exclusive with the `select` field.

- `include`

    An object specifying the relations to include in the result. Setting a relation to `true` means to include it. You can pass an object to further choose what fields/relations are included for the relation, and/or a `where` clause to filter the included relation records.

    This field is optional. If not provided, no relations are included by default. The `include` field is mutually exclusive with the `select` field.

- `omit`

    An object specifying the fields to omit from the result. Setting a field to `true` means to omit it. Only applicable to non-relation fields.

    This field is optional. If not provided, no fields are omitted by default. The `omit` field is mutually exclusive with the `select` field.
    
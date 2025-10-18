---
sidebar_position: 10
---

# Input Validation


- **String & List**
    - `@length`
        
        Specifies the minimum and/or maximum length of a string or list field.

- **String**
    - `@startsWith`

        Requires a string field to start with a given prefix.

    - `@endsWith`
  
        Requires a string field to end with a given suffix.

    - `@contains`: requires a string field to contain a given substring.
    - `@email`: requires a string field to be a valid email address.
    - `@url`: requires a string field to be a valid URL.
    - `@datetime`: requires a string field to be a valid ISO 8601 datetime.
    - `@regex`: requires a string field to match a given regular expression.
    - `@lower`: transforms a string field to lowercase before saving to the database.
    - `@upper`: transforms a string field to uppercase before saving to the database.
    - `@trim`: trims whitespace from both ends of a string field before saving to the database.

- **Number**
    - `@lt`: requires a number field to be less than a given value.
    - `@lte`: requires a number field to be less than or equal to a given value.
    - `@gt`: requires a number field to be greater than a given value.
    - `@gte`: requires a number field to be greater than or equal to a given value.


- `now()`: returns the current datetime.
- `length()`: returns the length of a string or list field.
- `startsWith()`: checks if a string field starts with a given prefix.
- `endsWith()`: checks if a string field ends with a given suffix.
- `contains()`: checks if a string field contains a given substring.
- `isEmail()`: checks if a string field is a valid email address.
- `isUrl()`: checks if a string field is a valid URL.
- `isDateTime()`: checks if a string field is a valid ISO 8601 datetime.
- `regex()`: checks if a string field matches a given regular expression.
- `has()`: checks if a list field contains a given element.
- `hasSome()`: checks if a list field contains at least one element from a given list.
- `hasEvery()`: checks if a list field contains all elements from a given list.
- `isEmpty()`: checks if a list field is empty.


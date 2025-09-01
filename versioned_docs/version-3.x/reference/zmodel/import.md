---
sidebar_position: 8
---

# Import

ZModel allows to import other ZModel files. This is useful when you want to split your schema into multiple files for better organization.

## Syntax

```zmodel
import IMPORT_SPEC
```

- **IMPORT_SPEC**: 

    Path to the ZModel file to be imported. It can be:
    
    - An absolute path, e.g., "/path/to/user".
    - A relative path, e.g., "./user".
    - A module resolved to an installed NPM package, e.g., "my-package/base".

    If the import specification doesn't end with ".zmodel", the resolver will automatically append it. Once a file is imported, all the declarations in that file will be included in the building process.

## Examples

```zmodel
// there is a file called "user.zmodel" in the same directory
import "user"
```

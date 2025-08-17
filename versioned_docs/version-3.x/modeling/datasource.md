---
sidebar_position: 2
description: Datasource in ZModel
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ZModelVsPSL from '../_components/ZModelVsPSL';

# Data Source

The `datasource` block provides information about the database your application uses. The ORM relies on it to determine the proper SQL dialect to use when generating queries. If you use [Migration](../orm/migration.md), it must also have a `url` field that specifies the database connection string, so that the migration engine knows how to connect to the database. The `env` function can be used to reference environment variables so you can keep sensitive information out of the code.

Each ZModel schema must have exactly one `datasource` block.

<Tabs>

<TabItem value="postgresql" label="PostgreSQL" default>
```zmodel
datasource db {
    provider = 'postgresql'
    url      = env('DATABASE_URL')
}
```
</TabItem>

<TabItem value="sqlite" label="SQLite">
```zmodel
datasource db {
    provider = 'sqlite'
    url      = 'file:./dev.db'
}
```
</TabItem>

</Tabs>

Currently only PostgreSQL and SQLite are supported. MySql will be supported in a future release. There's no plan for other relational database types or NoSQL databases.

<ZModelVsPSL>
ZenStack's ORM runtime doesn't rely on the `url` information to connect to the database. Instead, you provide the information when constructing an ORM client. More on this in the [ORM](../orm/) section.
</ZModelVsPSL>

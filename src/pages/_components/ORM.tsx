import CodeBlock from '@theme/CodeBlock';

export default function ORM(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-2xl md:text-3xl lg:text-4xl items-center justify-center pb-4">
                    <div className="flex items-center text-center">Flexible and Awesomely Typed ORM</div>
                </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 mt-4">
                <CodeBlock language="ts" className="p-4 hidden md:block xl:text-lg">
                    {`import { schema } from './zenstack';
import { ZenStackClient } from '@zenstackhq/orm';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';

const db = new ZenStackClient(schema, { ... })
  // install access control plugin to enforce policies
  .$use(new PolicyPlugin())
  // set current user context
  .$setAuth(...);

// high-level query API
const userWithPosts = await db.user.findUnique({
  where: { id: userId },
  include: { posts: true }
});

// low-level SQL query builder API
const userPostJoin = await db
  .$qb
  .selectFrom('User')
  .innerJoin('Post', 'Post.authorId', 'User.id')
  .select(['User.id', 'User.email', 'Post.title'])
  .where('User.id', '=', userId)
  .execute();
`}
                </CodeBlock>
                <div className="md:p-4 lg:p-8 text-lg">
                    <h3 className="hidden md:block text-2xl font-semibold">
                        An ORM is derived from the schema that gives you
                    </h3>
                    <ul className="md:text-xl flex flex-col gap-2 lg:mt-4 list-none p-0 lg:p-6">
                        <li>🔋 High-level ORM query API</li>
                        <li>🔋 Low-level SQL query builder API</li>
                        <li>🔋 Access control enforcement</li>
                        <li>🔋 Runtime data validation</li>
                        <li>🔋 Computed fields and custom procedures</li>
                        <li>🔋 Plugin system for tapping into various lifecycle events</li>
                    </ul>
                    <span className="lg:text-xl">
                        ZenStack's ORM is built on top of the awesome <a href="https://kysely.dev/">Kysely</a> SQL query
                        builder. Its query API is compatible with that of{' '}
                        <a href="https://www.prisma.io/docs/orm/prisma-client">Prisma Client</a>, so migrating an
                        existing Prisma project will require minimal code changes.{' '}
                        <a href="/docs/migrate-prisma">Read more</a> about migrating from Prisma.
                    </span>
                </div>
            </div>
        </div>
    );
}

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Service(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-2xl md:text-3xl lg:text-4xl items-center justify-center pb-4">
                    <div className="flex items-center">Automatic HTTP Query Service</div>{' '}
                    <span className="ml-2 text-emerald-500 dark:text-emerald-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-xl border border-solid border-emerald-500 dark:border-emerald-600">
                        coming soon
                    </span>
                </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 mt-4">
                <div className="md:p-4 lg:p-8 text-lg">
                    <h3 className="hidden md:block text-2xl font-semibold">
                        Thanks to the ORM's built-in access control, you get an HTTP query service for free
                    </h3>
                    <ul className="md:text-xl flex flex-col gap-2 lg:mt-4 list-none p-0 lg:p-6">
                        <li>🚀 Fully mirrors the ORM API</li>
                        <li>🚀 Seamlessly integrates with popular frameworks</li>
                        <li>🚀 Works with any authentication solution</li>
                        <li>
                            🚀 Type-safe client SDK powered by <a href="https://tanstack.com/query">TanStack Query</a>
                        </li>
                        <li>🚀 Highly customizable</li>
                    </ul>
                    <span className="lg:text-xl">
                        <p>
                            Since the ORM is protected with access control, ZenStack can directly map it to an HTTP
                            service. ZenStack provides out-of-the-box integrations with popular frameworks including
                            Next.js, Nuxt, Express, etc.
                        </p>
                        <p>
                            Client hooks based on <a href="https://tanstack.com/query">TanStack Query</a> can also be
                            derived from the schema, allowing you to make type-safe queries to the service without
                            writing a single line of code.
                        </p>
                    </span>
                </div>
                <div className="hidden md:block">
                    <Tabs>
                        <TabItem label="Server Code" value="server">
                            <CodeBlock language="ts" title="Next.js Example" className="p-2 xl:text-lg">
                                {`import { NextRequestHandler } from '@zenstackhq/server/next';
import { db } from './db'; // ZenStackClient instance
import { getSessionUser } from './auth';

// callback to provide a per-request ORM client
async function getClient() {
  // call a framework-specific helper to get session user                    
  const authUser = await getSessionUser();

  // return a new ORM client configured with the user,
  // the user info will be used to enforce access control
  return db.$setAuth(authUser);
}

// Create a request handler for all requests to this route
// All CRUD requests are forwarded to the underlying ORM
const handler = NextRequestHandler({ getClient });

export {
  handler as GET,
  handler as PUT
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
                    `}
                            </CodeBlock>
                        </TabItem>
                        <TabItem label="Client Code" value="client">
                            <CodeBlock language="tsx" title="React Example" className="p-4 xl:text-lg">
                                {`import { schema } from './zenstack';
import { useQueryHooks } from '@zenstackhq/query/react';

export function UserPosts({ userId }: { userId: number }) {
  // use auto-generated hook to query user with posts
  const { user: userHooks } = useQueryHooks(schema);
  const { data, isLoading } = userHooks.useFindUnique({
  where: { id: userId },
  include: { posts: true }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
  <div>
    <p>{data?.email}'s Posts</p>
    <ul>
    {data?.posts.map((post) => (
      <li key={post.id}>{post.title}</li>
    ))}
    </ul>
  </div>
  );
}
                    `}
                            </CodeBlock>
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

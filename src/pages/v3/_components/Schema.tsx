import CodeBlock from '@theme/CodeBlock';

export default function SchemaLanguage(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-2xl md:text-3xl lg:text-4xl items-center justify-center pb-4">
                    <div className="flex items-center text-center">Intuitive and Expressive Data Modeling</div>
                </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 mt-4">
                <div className="md:p-4 lg:p-8 text-lg">
                    <h3 className="hidden md:block text-2xl font-semibold">The modeling language allows you to</h3>
                    <ul className="md:text-xl flex flex-col gap-2 lg:mt-4 list-none px-0 lg:p-6">
                        <li>✅ Define data models and relations</li>
                        <li>✅ Define access control policies</li>
                        <li>✅ Express data validation rules</li>
                        <li>✅ Model polymorphic inheritance</li>
                        <li>✅ Add custom attributes and functions to introduce custom semantics</li>
                        <li>✅ Implement custom code generators</li>
                    </ul>
                    <span className="lg:text-xl">
                        The schema language is a superset of{' '}
                        <a href="https://www.prisma.io/docs/orm/prisma-schema/overview">Prisma Schema Language</a>.
                        Migrating a Prisma schema is as simple as file renaming.
                    </span>
                </div>
                <CodeBlock language="zmodel" className="hidden md:block p-2 xl:text-lg">
                    {`model User {
  id        Int    @id
  email     String @unique @email // constraint and validation
  role      String
  posts     Post[]                // relation to another model
  postCount Int    @computed      // computed field

  // access control rules colocated with data
  @@allow('all', auth().id == id)
  @@allow('create, read', true)
}

model Post {
  id        Int
  title     String  @length(1, 255)
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int     // relation foreign key

  @@allow('read', published)
  @@allow('all', auth().id == authorId || auth().role == 'ADMIN')
}`}
                </CodeBlock>
            </div>
        </div>
    );
}

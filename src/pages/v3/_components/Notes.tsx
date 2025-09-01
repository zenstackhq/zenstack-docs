import Link from '@docusaurus/Link';

export default function Notes(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-xl md:text-2xl lg:text-3xl items-center justify-center pb-4">
                    Notes to V2 Users
                </h2>
            </div>
            <div className="flex justify-center text-left">
                <blockquote className="lg:max-w-3/4 text-lg italic">
                    ZenStack V3 has made the bold decision to remove Prisma as a runtime dependency and implement its
                    own ORM infrastructure on top of <a href="https://kysely.dev">Kysely</a>. Albeit the cost of such a
                    big refactor, we believe this is the right move to gain the flexibility needed to achieve the
                    project's vision. Please read this <Link to="/blog/next-chapter-1">blog post</Link> for more
                    thoughts behind the changes.
                </blockquote>
            </div>
        </div>
    );
}

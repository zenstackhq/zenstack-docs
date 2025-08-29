export default function Notes(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-xl md:text-2xl lg:text-3xl items-center justify-center pb-4">
                    <div className="flex items-center">Notes to V2 Users</div>
                </h2>
            </div>
            <div className="flex justify-center text-left">
                <blockquote className="lg:max-w-3/4 text-lg italic">
                    ZenStack V3 has made the bold decision to remove Prisma as a runtime dependency and implement its
                    own ORM infrastructure on top of <a href="https://kysely.org">Kysely</a>. Albeit the cost of such a
                    big refactor, we believe this is the right move to gain the flexibility needed to achieve the
                    project's vision. Please read <a href="/blog/next-chapter-1">blog post</a> for more thoughts behind
                    the changes.
                </blockquote>
            </div>
        </div>
    );
}

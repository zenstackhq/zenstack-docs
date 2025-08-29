type FeatureItem = {
    title: string;
    img: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Coherent Application Model',
        img: '/img/access-control.png',
        description: (
            <>
                When LLMs see a self-contained, non-ambiguous, and well-defined application model, their inference works
                more efficiently and effectively.
            </>
        ),
    },
    {
        title: 'Concise Query API',
        img: '/img/auto-api.png',
        description: (
            <>
                Concise and expressive, while leveraging existing knowledge of Prisma and Kysely, the query API makes it
                easy for LLMs to generate high-quality query code.
            </>
        ),
    },
    {
        title: 'Slim Code Base',
        img: '/img/ai-friendly.png',
        description: (
            <>
                By deriving artifacts from the schema instead of implementing them, ZenStack helps you maintain a slim
                code base that is easier for AI to digest.
            </>
        ),
    },
];

function Proposition({ title, img, description }: FeatureItem) {
    return (
        <div className="lg:max-w-1/3 w-full">
            <div className="text-center">
                <img className="w-48 p-10" src={img} alt={title} />
            </div>
            <div className="text--center padding-horiz--md">
                <h3 className="text-xl text-bold text-center lg:text-2xl text-gray-700 dark:text-gray-300">{title}</h3>
                <p className="text-center text-base lg:text-lg text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
}

export default function AICoding(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-2xl md:text-3xl lg:text-4xl items-center justify-center pb-4">
                    Perfect Match for AI-Assisted Programming
                </h2>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-0">
                {FeatureList.map((props, idx) => (
                    <Proposition key={idx} {...props} />
                ))}
            </div>
        </div>
    );
}

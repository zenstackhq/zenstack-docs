type FeatureItem = {
    title: string;
    img: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Coherent Schema',
        img: '/img/diagram.png',
        description: (
            <>
                Simple schema language to capture the most important aspects of your application in one place: data and
                security.
            </>
        ),
    },
    {
        title: 'Powerful ORM',
        img: '/img/search.png',
        description: (
            <>One-of-a-kind ORM that combines type-safety, query flexibility, and access control in one package.</>
        ),
    },
    {
        title: 'Limitless Utility',
        img: '/img/versatility.png',
        description: (
            <>Deriving crucial artifacts that streamline development from backend APIs to frontend components.</>
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

export default function ValueProps(): JSX.Element {
    return (
        <div className="flex flex-wrap gap-4 md:gap-0">
            {FeatureList.map((props, idx) => (
                <Proposition key={idx} {...props} />
            ))}
        </div>
    );
}

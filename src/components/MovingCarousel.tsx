import * as React from 'react';
import clsx from 'clsx';

interface ICarouselProps {
    direction: 'left' | 'right';
    className?: string;
}

export default function MovingCarousel(props: React.PropsWithChildren<ICarouselProps>) {
    return (
        <figure className="mx-0 relative w-full h-14">
            <InfiniteLooper {...props} />
            <div className="absolute inset-0 bg-carousel-gradient-x" />
        </figure>
    );
}

function InfiniteLooper({ direction, className, children, ...props }: React.PropsWithChildren<ICarouselProps>) {
    const [looperInstances, setLooperInstances] = React.useState(1);
    const outerRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = React.useState(false);

    function resetAnimation() {
        if (!innerRef?.current) return;
        setIsActive(false);
        window.setTimeout(() => {
            if (innerRef?.current) setIsActive(true);
        }, 10);
    }

    const setupInstances = React.useCallback(() => {
        if (!innerRef?.current || !outerRef?.current) return;
        const { width } = innerRef.current.getBoundingClientRect();
        const { width: parentWidth } = outerRef.current.getBoundingClientRect();

        const widthDeficit = parentWidth - width;
        const instanceWidth = width / innerRef.current.children.length;

        if (widthDeficit && instanceWidth > 0) {
            setLooperInstances(
                (prevLooperInstances) => prevLooperInstances + Math.ceil(widthDeficit / instanceWidth) + 1
            );
        }

        resetAnimation();
    }, [direction]);

    React.useEffect(() => setupInstances(), [setupInstances]);

    React.useEffect(() => {
        window.addEventListener('resize', setupInstances);
        return () => window.removeEventListener('resize', setupInstances);
    }, [setupInstances]);

    return (
        <div {...props} ref={outerRef} className="relative h-full w-full overflow-hidden">
            <div ref={innerRef} className={clsx('absolute inset-0 flex h-full w-fit', className)}>
                {[...Array(looperInstances)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx('flex w-max flex-row', {
                            'animate-infinite-carousel-left': isActive && direction === 'left',
                            'animate-infinite-carousel-right': isActive && direction === 'right',
                        })}
                    >
                        {children}
                    </div>
                ))}
            </div>
        </div>
    );
}

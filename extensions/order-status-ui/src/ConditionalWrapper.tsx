type ConditionalWrapperProps = React.PropsWithChildren<{
    shouldWrap: boolean;
    wrapper: (children: React.ReactNode) => React.ReactNode;
}>;

export const ConditionalWrapper = ({ shouldWrap, wrapper, children }: ConditionalWrapperProps) => (
    <>{shouldWrap ? wrapper(children) : children}</>
);

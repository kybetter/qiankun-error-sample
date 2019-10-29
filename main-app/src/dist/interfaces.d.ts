/**
 * @author kuitos
 * @since 2019-05-16
 */
export declare type render = (props: {
    appContent: string;
    loading: boolean;
}) => any;
export declare type Entry = string | {
    scripts?: string[];
    styles?: string[];
    html?: string;
};
export declare type RegistrableApp<T extends object = {}> = {
    name: string;
    entry: Entry;
    render: render;
    activeRule: (location: Location) => boolean;
    props?: T;
};
export declare type StartOpts = {
    prefetch?: boolean;
    jsSandbox?: boolean;
    singular?: boolean | ((app: RegistrableApp<any>) => Promise<boolean>);
    fetch?: Fetch;
};
export declare type Rebuilder = () => void;
export declare type Freer = () => Rebuilder;
export declare type Fetch = typeof fetch;

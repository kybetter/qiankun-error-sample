/**
 * @author Kuitos
 * @since 2019-04-25
 */
import { Fetch, RegistrableApp, StartOpts } from './interfaces';
declare global {
    interface Window {
        __POWERED_BY_QIANKUN__?: boolean;
    }
}
declare type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;
export declare type LifeCycles<T extends object> = {
    beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>;
    beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>;
    afterMount?: Lifecycle<T> | Array<Lifecycle<T>>;
    beforeUnmount?: Lifecycle<T> | Array<Lifecycle<T>>;
    afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>;
};
declare type RegisterMicroAppsOpts = {
    fetch?: Fetch;
};
export declare function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles?: LifeCycles<T>, opts?: RegisterMicroAppsOpts): void;
export * from './effects';
export declare function start(opts?: StartOpts): void;

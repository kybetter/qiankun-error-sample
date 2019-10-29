/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { Entry } from 'import-html-entry';
import { RegistrableApp, Fetch } from './interfaces';
/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 * @param fetch
 */
export declare function prefetch(entry: Entry, fetch?: Fetch): void;
export declare function prefetchAfterFirstMounted(apps: RegistrableApp[], fetch?: Fetch): void;

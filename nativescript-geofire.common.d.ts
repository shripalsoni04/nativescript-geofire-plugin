export declare type GeoQueryEventType = 'key_entered' | 'key_exited' | 'key_moved' | 'ready';
export declare type QueryCallbackType = (key: string, location: number[]) => any;
export interface IQueryCriteria {
    center: number[];
    radius: number;
}
export interface IQueryUpdateCriteria {
    center?: number[];
    radius?: number;
}
export declare class NSGeoFireCommon {
    constructor();
}
export declare class NSGeoQueryCommon {
    protected queryHandles: {
        key_entered: any[];
        key_exited: any[];
        key_moved: any[];
        ready: any[];
    };
    protected query: any;
    cancel(): void;
}

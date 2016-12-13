/// <reference types="es6-promise" />
import { NSGeoFireCommon, NSGeoQueryCommon, IQueryCriteria, IQueryUpdateCriteria, QueryCallbackType, GeoQueryEventType } from './nativescript-geofire.common';
export declare class NSGeoFire extends NSGeoFireCommon {
    private geoFire;
    private geoQuery;
    constructor(refPath: string);
    query(criteria: IQueryCriteria, callback: QueryCallbackType): NSGeoQuery;
    get(key: string): Promise<number[]>;
    set(key: string, location: number[]): Promise<any>;
    remove(key: string): Promise<any>;
}
export declare class NSGeoQuery extends NSGeoQueryCommon {
    private geoFire;
    private criteria;
    private callback;
    constructor(geoFire: any, criteria: IQueryCriteria, callback: QueryCallbackType);
    execute(): void;
    on(eventType: GeoQueryEventType, callback: QueryCallbackType): NSGeoCallbackRegistration;
    updateCriteria(criteria: IQueryUpdateCriteria): void;
    center(): number[];
    radius(): number;
    private getIOSEventType(eventType);
    private getNativeLocationCriteria(latitude, longitude);
    private getResultLocationObject(location);
}
export declare class NSGeoCallbackRegistration {
    private query;
    private queryHandle;
    constructor(query: any, queryHandle: any);
    cancel(): void;
}

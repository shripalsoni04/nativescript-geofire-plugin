import { NSGeoQuery, NSGeoCallbackRegistration } from './nativescript-geofire';

/**
 * All possible geoQuery events.
 */
export type GeoQueryEventType = 'key_entered' | 'key_exited' | 'key_moved' | 'ready';

export type QueryCallbackType = (key: string, location: number[]) => any;

/**
 * Query criteria which accepts center and radius.
 */
export interface IQueryCriteria {
  center: number[],
  radius: number
}

/**
 * Query criteria for updateCriteria method. For this method, center and radius
 * are optional. So you can update anyone or both of them.
 */
export interface IQueryUpdateCriteria {
  center?: number[];
  radius?: number;
}

/**
 * Contains common functionalities of GeoFire for android and ios.
 */
export class NSGeoFireCommon {
  constructor() { }
}

/**
 * Contains common functionalities of GeoFireQuery for android and ios.
 */
export class NSGeoQueryCommon {
  protected queryHandles = {
    key_entered: [],
    key_exited: [],
    key_moved: [],
    ready: []
  };

  protected query: any;

  /**
   * Cancels all the event listeners of the query.
   */
  cancel() {
    this.query.removeAllObservers();

    ['key_entered', 'key_exited', 'key_moved', 'ready'].forEach((eventType: string) => {
      this.queryHandles[eventType].forEach((item) => {
        item.cancel();
      });
      this.queryHandles[eventType] = [];
    });
  }
}

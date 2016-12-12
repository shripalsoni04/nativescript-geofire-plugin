import {
  NSGeoFireCommon, NSGeoQueryCommon, IQueryCriteria, QueryCallbackType,
  GeoQueryEventType, IQueryUpdateCriteria
} from './nativescript-geofire.common';

export declare class NSGeoFire extends NSGeoFireCommon {

  /**
   * @param refPath Firebase path where geo data will be stored.
   */
  constructor(refPath: string);

  /**
   * Triggers query and returns a new NSGeoQuery instance with the provided queryCriteria.
   *
   * @param queryCriteria The criteria which specifies the GeoQuery's center and radius.
   */
  query(criteria: IQueryCriteria): NSGeoQuery;

  /**
   * Returns location for the specified key.
   *
   * @param key Key by which the location is stored.
   */
  get(key: string): Promise<number[]>;

  /**
   * Sets location at the specified key. If location is already stored by this key,
   * it will be replaced.
   *
   * @param key Key by which the location will be stored.
   * @param location  Location [latitude, longitude] to store.
   */
  set(key: string, location: number[]): Promise<any>;

  /**
   * Removes location at the specified key.
   *
   * @param key Key by which the location is stored.
   */
  remove(key: string): Promise<any>;

}

export declare class NSGeoQuery extends NSGeoQueryCommon {

  /**
   * Attaches a callback function to geoFireQuery's various events like 'key_entered',
   * 'key_exited', 'key_moved' and 'ready'.
   *
   * @param eventType The event type for which to attach the callback. One of
   * "ready", "key_entered", "key_exited", or "key_moved
   *
   * @param callback Callback function to be called when an event of type eventType fires.
   *
   * @return A callback registration which can be used to cancel the provided
   * callback.
   */
  on(eventType: GeoQueryEventType, callback: QueryCallbackType): NSGeoCallbackRegistration;

  /**
   * Updates the criteria for this query.
   *
   * @param criteria The criteria which specifies the query's center and radius.
   */
  updateCriteria(criteria: IQueryUpdateCriteria): void;

  /**
   * Returns the location signifying the center of this query.
   *
   * @return The [latitude, longitude] pair signifying the center of this query.
   */
  center(): number[];

  /**
   * Returns the radius of this query, in kilometers.
   *
   * @return The radius of this query, in kilometers.
   */
  radius(): number;

  /**
   * Terminates this query so that it no longer sends location updates. All
   * callbacks attached to this query via on() will be cancelled.
   */
  cancel(): void;
}

/**
 * A simple wrapper around the event listener of geoFire query which provides
 * functionality to cancel any event listener.
 */
export declare class NSGeoCallbackRegistration {
  /**
   * Cancels the query event listener.
   */
  cancel(): void;
}

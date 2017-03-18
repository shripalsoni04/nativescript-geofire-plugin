import {
  NSGeoFireCommon, NSGeoQueryCommon, IQueryCriteria,
  IQueryUpdateCriteria, QueryCallbackType, GeoQueryEventType
} from './nativescript-geofire.common';

declare const GeoFire: any;
declare const FIRDatabase: any;
declare const CLLocation: any;
declare const GFEventTypeKeyEntered: any;
declare const GFEventTypeKeyExited: any;
declare const GFEventTypeKeyMoved: any;

export class NSGeoFire extends NSGeoFireCommon {

  private geoFire: any;

  private geoQuery: NSGeoQuery;

  constructor(refPath: string) {
    super();
    let fbDatabaseRef = FIRDatabase.database().reference().childByAppendingPath(refPath);
    this.geoFire = GeoFire.alloc().initWithFirebaseRef(fbDatabaseRef);
  }

  query(criteria: IQueryCriteria, callback: QueryCallbackType) {
    this.geoQuery = new NSGeoQuery(this.geoFire, criteria, callback);
    this.geoQuery.execute();
    return this.geoQuery;
  }

  get(key: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.geoFire.getLocationForKeyWithCallback(key, (location, error) => {
        if (error) {
          return reject(error.localizedDescription);
        } else {
          return resolve([location.coordinate.latitude, location.coordinate.longitude]);
        }
      });
    });
  }

  set(key: string, location: number[]): Promise<any> {
    let clLocation = CLLocation.alloc().initWithLatitudeLongitude(location[0], location[1]);
    return new Promise((resolve, reject) => {
      this.geoFire.setLocationForKeyWithCompletionBlock(clLocation, key, (error) => {
        if (error) {
          return reject(error.localizedDescription);
        } else {
          return resolve();
        }
      });
    })
  }

  remove(key: string): Promise<any> {
    if (!key) {
      return Promise.reject('Key must be provided to remove the location.');
    }

    return new Promise(resolve => {
      this.geoFire.removeKey(key);
      resolve();
    });
  }
}

export class NSGeoQuery extends NSGeoQueryCommon {

  constructor(
    private geoFire: any,
    private criteria: IQueryCriteria,
    private callback: QueryCallbackType
  ) {
    super();
  }

  execute(): void {
    let center = this.getNativeLocationCriteria(
      this.criteria.center[0],
      this.criteria.center[1]
    );

    this.query = this.geoFire.queryAtLocationWithRadius(
      center,
      this.criteria.radius
    );
  }

  on(eventType: GeoQueryEventType, callback: QueryCallbackType): NSGeoCallbackRegistration {
    let queryHandle;
    if (eventType === 'ready') {
      queryHandle = this.query.observeReadyWithBlock(callback);
    } else {
      queryHandle = this.query.observeEventTypeWithBlock(
        this.getIOSEventType(eventType),
        (key: string, location: any) => {
          callback(key, this.getResultLocationObject(location));
        }
      )
    }

    let geoCallbackRegistration = new NSGeoCallbackRegistration(
      this.query, queryHandle
    );
    this.queryHandles[eventType].push(geoCallbackRegistration);
    return geoCallbackRegistration;
  }

  updateCriteria(criteria: IQueryUpdateCriteria): void {
    if (criteria.center) {
      this.query.center = this.getNativeLocationCriteria(
        criteria.center[0],
        criteria.center[1]
      );
    }

    if (criteria.radius) {
      this.query.radius = criteria.radius;
    }
  }

  center(): number[] {
    return this.getResultLocationObject(this.query.center);
  }

  radius(): number {
    return this.query.radius;
  }

  cancel() {
    this.query.removeAllObservers();
    super.cancel();
  }
  /**
   * Returns ios EventTypes for the specified eventType.
   */
  private getIOSEventType(eventType: GeoQueryEventType) {
    if (eventType === 'key_entered') {
      return GFEventTypeKeyEntered;
    } else if (eventType === 'key_exited') {
      return GFEventTypeKeyExited;
    } else if (eventType === 'key_moved') {
      return GFEventTypeKeyMoved
    }
  }

  /**
   * Returns instance of CLLocation based on specified latitude and longitude
   * values.
   */
  private getNativeLocationCriteria(latitude: number, longitude: number): any {
    return CLLocation.alloc().initWithLatitudeLongitude(latitude, longitude);
  }

  /**
   * Converts ios CLLocation object to [latitude, longitude] to send it
   * to js layer.
   */
  private getResultLocationObject(location: any): number[] {
    if (!location) {
      return null;
    }

    return [location.coordinate.latitude, location.coordinate.longitude];
  }
}

export class NSGeoCallbackRegistration {

  constructor(
    private query: any,
    private queryHandle: any
  ) {

  }

  /**
   * Clears queryHandle attached to the event. After being canceled this listener
   * will be not be executed.
   */
  cancel(): void {
    this.query.removeObserverWithFirebaseHandle(this.queryHandle);
    this.query = null;
    this.queryHandle = null;
  }
}

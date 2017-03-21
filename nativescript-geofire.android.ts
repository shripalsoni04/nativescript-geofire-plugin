import {
  NSGeoFireCommon, NSGeoQueryCommon, IQueryCriteria,
  IQueryUpdateCriteria, QueryCallbackType, GeoQueryEventType
} from './nativescript-geofire.common';

declare const com: any;

export class NSGeoFire extends NSGeoFireCommon {

  /**
   * An instance of GeoFire for android.
   */
  private geoFire: any;

  /**
   * Instance of current NSGeoQuery.
   */
  private geoQuery: NSGeoQuery;

  /**
   * @param refPath Path of the firebase database, where geoLocation data will be
   * stored and queried.
   */
  constructor(refPath: string) {
    super();
    let FBDatanbase = com.google.firebase.database.FirebaseDatabase;
    let fbRef = FBDatanbase.getInstance().getReference(refPath);
    this.geoFire = new com.firebase.geofire.GeoFire(fbRef);
  }

  query(criteria: IQueryCriteria, callback: QueryCallbackType) {
    this.geoQuery = new NSGeoQuery(this.geoFire, criteria, callback);
    this.geoQuery.execute();
    return this.geoQuery;
  }

  get(key: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      new com.firebase.geofire.LocationCallback({
        onLocationResult: (key: string, location: any) => {
          resolve([location.latitude, location.longitude]);
        },
        onCancelled: (error) => {
          reject(error.getMessage());
        }
      });
    });
  }

  set(key: string, location: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let completionListener = new com.firebase.geofire.GeoFire.CompletionListener({
        onComplete: (key: string, error: any) => {
          if (error) {
            reject(error.getMessage());
          } else {
            resolve();
          }
        }
      });

      let geoLocation = new com.firebase.geofire.GeoLocation(location[0], location[1]);
      this.geoFire.setLocation(key, geoLocation, completionListener);
    })
  }

  remove(key: string): Promise<any> {
    if (!key) {
      return Promise.reject('Key must be provided to remove the location.');
    }

    return new Promise(resolve => {
      this.geoFire.removeLocation(key);
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

    this.query = this.geoFire.queryAtLocation(
      center,
      this.criteria.radius
    );

    let listeners = new com.firebase.geofire.GeoQueryEventListener({
      onKeyEntered: this.getQueryHandler('key_entered'),
      onKeyExited: this.getQueryHandler('key_exited'),
      onKeyMoved: this.getQueryHandler('key_moved'),
      onGeoQueryReady: this.getQueryHandler('ready')
    });

    this.query.addGeoQueryEventListener(listeners);
  }

  on(eventType: GeoQueryEventType, callback: QueryCallbackType): NSGeoCallbackRegistration {
    // For android, we need to maintain callback registration and removal manually,
    // as registering multiple native listener will not work for android.
    let geoCallbackRegistration = new NSGeoCallbackRegistration(callback);
    this.queryHandles[eventType].push(geoCallbackRegistration);
    return geoCallbackRegistration;
  }

  updateCriteria(criteria: IQueryUpdateCriteria): void {
    if (criteria.center) {
      let center = this.getNativeLocationCriteria(
        criteria.center[0],
        criteria.center[1]
      );

      this.query.setCenter(center);
    }

    if (criteria.radius) {
      this.query.setRadius(criteria.radius);
    }
  }

  center(): number[] {
    return this.getResultLocationObject(this.query.getCenter());
  }

  radius(): number {
    return this.query.getRadius();
  }

  /**
   * Prepares and returns listener for the specified eventType.
   * The listeners calls all the callback registered for the eventType.
   */
  private getQueryHandler(eventType: GeoQueryEventType) {
    return (key: string, location: any) => {
      this.queryHandles[eventType].forEach((item) => {
        if (item.callback) {
          item.callback(key, this.getResultLocationObject(location));
        }
      });
    }
  }

  /**
   * Returns instance of GeoLocation based on specified latitude and longitude
   * values.
   */
  private getNativeLocationCriteria(latitude: number, longitude: number): any {
    return new com.firebase.geofire.GeoLocation(latitude, longitude);
  }

  /**
   * Converts android GeoLocation object to [latitude, longitude] to send it
   * to js layer.
   */
  private getResultLocationObject(location: any): number[] {
    if (!location) {
      return null;
    }

    return [location.latitude, location.longitude];
  }
}

export class NSGeoCallbackRegistration {

  constructor(
    private callback: any
  ) { }

  /**
   * Clears callback attached to the event. After being canceled this callback
   * will be not be executed.
   */
  cancel(): void {
    this.callback = null;
  }
}

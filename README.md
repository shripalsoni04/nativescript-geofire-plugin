# Nativescript-Geofire-Plugin

GeoFire for Nativescript - Realtime location queries with Firebase.

The API for this plugin is kept nearly same as of the [web version of geofire](https://github.com/firebase/geofire-js) to increase code reuse across platforms and for easy usage.

## Installation
`tns plugin add nativescript-geofire-plugin`

This plugin requires Firebase to be added into your project. So if it is not added, you can add it by installing an awesome [ firebase plugin for nativescript](https://github.com/EddyVerbruggen/nativescript-plugin-firebase) by executing below command:

`tns plugin add nativescript-plugin-firebase`

## Basic Usage
```
import { NSGeoFire } from 'nativescript-geofire-plugin';

// Here '/geo' is the firebase path which will be used by geoFire for location queries. You can change it to anything.
let geoFire = new NSGeoFire('/geo');

let query = this.geoFire.query({
    center: [lat, long],
    radius: radius
});

query.on('key_entered', (key: string, location: number[]) => {
    console.log('key entered ', key, location);
});

query.on('key_exited', (key: string) => {
    console.log('key exited ', key);
});

query.on('key_moved', (key: string, location: number[]) => {
    console.log('key moved ', key, location);
});

query.on('ready', () => {
    console.log('GeoQuery has loaded and fired all other events for initial data');
});
```

## API
For now, refer API from [nativescript-geofire.d.ts]() file.

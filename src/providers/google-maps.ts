import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Location } from '../providers/location';
import { Site } from '../providers/site';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import 'rxjs/add/operator/map';

/*
  Generated class for the GoogleMaps provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/


declare var google;
@Injectable()
export class GoogleMaps {
    map: any;
    markers: any = [];
    gisData;
    start: string;
    markerCount;
    markerEnd;

    constructor(private http: Http, private config: Config, private location: Location, private site: Site, private launchNavigator: LaunchNavigator) {
        console.log('Hello GoogleMaps Provider');

    }

    //init map
    initMap(mapElement) {

        return new Promise((resolve, reject) => {

            this.location.getCurrentLocation().then((res) => {
                let latLng = new google.maps.LatLng(this.location.Latitude, this.location.Longitude);

                let mapOptions = {
                    center: latLng,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                this.map = new google.maps.Map(mapElement, mapOptions, );

                google.maps.event.addListenerOnce(this.map, 'idle', () => {

                    this.loadMarkers().then((res) => {
                        resolve();
                    });

                    google.maps.event.addListener(this.map, 'dragend', () => {
                        //this.loadMarkers();
                    });

                });

            });

            //})
        });
    }


    //load markers

    loadMarkers() {

        return new Promise((resolve, reject) => {

            // let center = this.map.getCenter(),
            //     bounds = this.map.getBounds();
            // zoom = this.map.getZoom();

            // Convert to readable format
            // let centerNorm = {
            //     lat: center.lat(),
            //     lng: center.lng()
            // };

            // let boundsNorm = {
            //     northEast: {
            //         lat: bounds.getNorthEast().lat(),
            //         lng: bounds.getNorthEast().lng()
            //     },
            //     southWest: {
            //         lat: bounds.getSouthWest().lat(),
            //         lng: bounds.getSouthWest().lng()
            //     }
            // };

            // let boundingRadius = this.getBoundingRadius(centerNorm, boundsNorm);

            // let options = {
            //     lng: centerNorm.lng,
            //     lat: centerNorm.lat,
            //     maxDistance: boundingRadius
            // }

            //this.getMarkers(options);

            this.getMarkers(this.site.Region).then((result) => {
                this.addMarkers(this.gisData);
                resolve();
            }, (err) => {
                console.log(err);
            });
        });
    }


    //get markers

    getMarkers(region) {

        return new Promise((resolve, reject) => {
            let command = "googlemapDB 'RGNName','" + region + "','--All Milestones--','','All'";

            this.http.get(this.config.queryApiUrl + command)
                .subscribe(res => {
                    let data = res.json();
                    if (data[0].length > 0) {
                        this.gisData = data[0];
                        this.markerCount = data[0].length;
                        resolve();
                    } else {
                        reject('error msg');
                    }
                }, (err) => {
                    reject(err._body);
                });

        });

    }


    //add markers

    addMarkers(markers) {

        markers.forEach((marker) => {

            let lat = marker.Latitude;
            let lng = marker.Longitude;
            let dist = this.location.getDistanceFromLatLonInKm(this.location.Latitude, this.location.Longitude, lat, lng);

            if (dist < this.location.GeoFenceLimit / 10) {
                //let destination = this.navigate(lat, lng);
                //let exporttomaps = this.navigate(lat, lng);

                let Content = "<strong>Site Name: </strong>" + marker.sitename + "</br> " + " " + '<strong>Site No: </strong>' + marker.siteno + "</br> " + '<strong>Lat Long:</strong>' + lat + " " + lng + "</br> " + "<strong>Distance: </strong>" + dist.toLocaleString() + " km</br >" + '<button type="button" id="myid">NAVIGATE</button>';

                let markerLatLng = new google.maps.LatLng(lat, lng);

                let icon = '';
                if (marker.sowid === this.site.SOWId)
                    icon = 'assets/img/current-site-marker.png';

                let gmarker = new google.maps.Marker({
                    map: this.map,
                    animation: google.maps.Animation.DROP,
                    position: markerLatLng,
                    icon: icon
                });

                let markerData = {
                    lat: lat,
                    lng: lng,
                    marker: gmarker
                };

                // let infowindow = new google.maps.InfoWindow({
                //     Content: Content,
                // });
                // marker.addListener('click', () => {
                //     infowindow.open(this.map, marker)
                // });

                let infowindow = new google.maps.InfoWindow({
                    content: Content
                });
                gmarker.addListener('click', () => {
                    infowindow.open(this.map, gmarker)
                });

                google.maps.event.addListener(infowindow, 'domready', () => {
                    document.getElementById('myid').addEventListener('click', () => {
                        //alert('Clicked');
                        this.navigate(markerData.lat, markerData.lng);
                    });
                });

                this.markers.push(markerData);
                if (this.markers.indexOf(markerData) === this.markerCount - 1)
                    this.markerEnd = true;
            }
        });
    }

    //calculate distance
    getBoundingRadius(center, bounds) {
        return this.getDistanceBetweenPoints(center, bounds.northEast, 'km');
    }

    getDistanceBetweenPoints(pos1, pos2, units) {
        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = pos1.lat;
        let lon1 = pos1.lng;
        let lat2 = pos2.lat;
        let lon2 = pos2.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;
    }

    toRad(x) {
        return x * Math.PI / 180;
    }

    // openUrl(lat, Long) {
    //     if (this.platform.is('android')) {
    //         window.open('maps://?q=' + this.destination, '_system');
    //     } else {
    //         let label = encodeURI('My Label');
    //         window.open('geo:0,0?q=' + this.destination + '(' + label + ')', '_system');
    //     }
    // }

    navigate(lat, lng) {
        let options: LaunchNavigatorOptions = {
            start: this.start
        };
        let destination = [lat, lng]
        this.launchNavigator.navigate(destination, options);
    }

}
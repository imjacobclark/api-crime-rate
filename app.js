"use strict";

const POSTCODE_API_RESOURCE = "/postcode/{date}/{postcode}";
const PLACE_API_RESOURCE = "/place/{date}/{place}";

const OK = 200;
const NOT_FOUND = 404;

const request = require("request-promise");
const Lambda = require("./lib/Lambda");
const LatLongGeocode = require("./lib/LatLongGeocode");
const PoliceData = require("./lib/PoliceData");

const latLongGeocode = new LatLongGeocode(request);

function getCrimeData(date, location){
  return location.then(location => {
    return new PoliceData(request).allStreetCrime(date, location.latitude, location.longitude).then(crimes => {
      return {
        "crimes": crimes,
        "location": location
      };
    })
  });
}

function getCrimeDataForPlace(date, place, callback){
  return getCrimeData(date, latLongGeocode.fromPlace(place))
    .then(data => callback(null, Lambda.generateResponse(JSON.stringify(data), OK)));   
}

function getCrimeDataForPostcode(date, postcode, callback){
  return getCrimeData(date, latLongGeocode.fromPostcode(postcode))
    .then(data => callback(null, Lambda.generateResponse(JSON.stringify(data), OK)));
}

exports.handler = function(event, context, callback) {
    if (event.resource === POSTCODE_API_RESOURCE) {
      getCrimeDataForPostcode(event.pathParameters.date, event.pathParameters.postcode, callback);
    } else if (event.resource === PLACE_API_RESOURCE){
       getCrimeDataForPlace(event.pathParameters.date, event.pathParameters.place, callback);
    } else {
      callback(null, Lambda.generateResponse("Sorry, we were unable to find what you were looking for!", NOT_FOUND));
    }
};
"use strict";

const API_BASE_URL = "https://api.postcodes.io";

function buildResponse(apiResponse){
  return {
    "name": apiResponse["name_1"],
    "postcode": apiResponse.outcode,
    "borough": apiResponse.district_borough,
    "latitude": apiResponse.latitude,
    "longitude": apiResponse.longitude
  }
}

class LatLongGeocode{
  constructor(request){
    this.request = request;
  }

  fromPostcode(postcode) {
    return this
      .request
      .get(API_BASE_URL + "/postcodes/" + postcode)
      .then(data => buildResponse(JSON.parse(data).result));
  }

  fromPlace(place) {
    return this
      .request
      .get(API_BASE_URL + "/places?q=" + place)
      .then(data => buildResponse(JSON.parse(data).result[0]))
  }
}

module.exports = LatLongGeocode;
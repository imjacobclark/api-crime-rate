"use strict";

const chai = require("chai");
const spies = require("chai-spies");

const LatLongGeocode = require("../../lib/LatLongGeocode");

chai.should();
chai.use(spies);

describe("LatLongGeocode", () => {
  describe("fromPostcode", () => {
    
    class MockRequest {
      get(url){
        let fakeResponse = {
          "result": {
            "name_1": "Earth",
            "outcode": "M43 9XX",
            "district_borough": "The Milky Way",
            "latitude": "lat",
            "longitude": "long"
          }
        }
        
        return Promise.resolve(JSON.stringify(fakeResponse));
      }
    }

    it("calls api with requested postcode", () => {
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let latLongGeocode = new LatLongGeocode(mockRequest);

      let expectedPostcode = "M43 9XX";
      let expectedEndpoint = "https://api.postcodes.io/postcodes/" + expectedPostcode;

      return latLongGeocode.fromPostcode(expectedPostcode).then(data => {
        spy.should.have.been.called.with(expectedEndpoint);
      });
    });

    it("returns expected latitude and longitude in result", () => {
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let latLongGeocode = new LatLongGeocode(mockRequest);

      let expectedPostcode = "M43 9XX";
      let expectedEndpoint = "https://api.postcodes.io/postcodes/" + expectedPostcode;

      return latLongGeocode.fromPostcode(expectedPostcode).then(data => {
        data.should.deep.include({"name": "Earth"});
        data.should.deep.include({"postcode": "M43 9XX"});
        data.should.deep.include({"borough": "The Milky Way"});
        data.should.deep.include({"latitude": "lat"});
        data.should.deep.include({"longitude": "long"});
      });
    });
  });

  describe("fromPlace", () => {
    class MockRequest {
      get(url){
        let fakeResponse = {
          "result": [{
            "name_1": "Earth",
            "outcode": "M43 9XX",
            "district_borough": "The Milky Way",
            "latitude": "lat",
            "longitude": "long"
          }]
        }

        return Promise.resolve(JSON.stringify(fakeResponse));
      }
    }

    it("calls api with requested location", () => {
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let latLongGeocode = new LatLongGeocode(mockRequest);

      let expectedLocation = "Earth";
      let expectedEndpoint = "https://api.postcodes.io/places?q=" + expectedLocation;

      return latLongGeocode.fromPlace(expectedLocation).then(data => {
        spy.should.have.been.called.with(expectedEndpoint);
      });
    });

    it("returns expected latitude and longitude in result", () => {
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let latLongGeocode = new LatLongGeocode(mockRequest);

      let expectedLocation = "Earth";
      let expectedEndpoint = "https://api.postcodes.io/places?q=" + expectedLocation;

      return latLongGeocode.fromPlace(expectedLocation).then(data => {
        data.should.deep.include({"name": "Earth"});
        data.should.deep.include({"postcode": "M43 9XX"});
        data.should.deep.include({"borough": "The Milky Way"});
        data.should.deep.include({"latitude": "lat"});
        data.should.deep.include({"longitude": "long"});
      });
    });
  });
});
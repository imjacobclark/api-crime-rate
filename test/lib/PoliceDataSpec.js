"use strict";

const BASE_API_URL = "https://data.police.uk/api/";

const chai = require("chai");
const spies = require("chai-spies");

const PoliceData = require("../../lib/PoliceData");

chai.should();
chai.use(spies);

describe("PoliceData", () => {
  describe("allStreetCrime", () => {
    
    class MockRequest {
      get(url){
        let fakeResponse = [
          {
            "category": "violent-crimes"
          },
          {
            "category": "violent-crimes"
          },
          {
            "category": "violent-crimes"
          },
          {
            "category": "robbery"
          }
        ]
        
        return Promise.resolve(JSON.stringify(fakeResponse));
      }
    }

    it("calls api with requested date, lat and long", () => {
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let policeData = new PoliceData(mockRequest);

      let date = "2017-04";
      let lat = "lat";
      let long = "long";
      let expectedEndpoint = BASE_API_URL + "crimes-street/all-crime?date=" + date + "&lat=" + lat +"&lng=" + long;

      return policeData.allStreetCrime(date, lat ,long).then(data => {
        spy.should.have.been.called.with(expectedEndpoint);
      });
    });

    it("returns key value pair of crime category and occourences", () => {
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let policeData = new PoliceData(mockRequest);

      let date = "2017-04";
      let lat = "lat";
      let long = "long";
      let expectedEndpoint = BASE_API_URL + "crimes-street/all-crime?date=" + date + "&lat=" + lat +"&lng=" + long;

      return policeData.allStreetCrime(date, lat, long).then(data => {
        data[0]['count'].should.equal(3);
        data[1]['count'].should.equal(1);
      });
    });

    it("returns empty array when no data returned from API", () => {
      class MockRequest {
        get(url){
          let fakeResponse = []
          
          return Promise.resolve(JSON.stringify(fakeResponse));
        }
      }
      
      let mockRequest = new MockRequest();
      let spy = chai.spy.on(mockRequest, "get");

      let policeData = new PoliceData(mockRequest);

      let date = "2017-04";
      let lat = "lat";
      let long = "long";
      let expectedEndpoint = BASE_API_URL + "crimes-street/all-crime?date=" + date + "&lat=" + lat +"&lng=" + long;

      return policeData.allStreetCrime(date, lat, long).then(data => {
        data.should.deep.equal([]);
      });
    });
  });
});
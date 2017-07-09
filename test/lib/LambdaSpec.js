"use strict";

const chai = require('chai');

const Lambda = require('../../lib/Lambda');

chai.should();

describe("Lambda", () => {
  describe("generateResponse", () => {
    it("will generate expected response object with isBase64Encoded false", () => {
      Lambda.generateResponse()
        .should.deep.include({"isBase64Encoded": false});
    });

    it("will generate expected response object with an empty headers object", () => {
      Lambda.generateResponse()
        .should.deep.include({"headers": {}});
    });

    it("will generate expected response object with an expected status code", () => {
      Lambda.generateResponse(null, 200)
        .should.deep.include({"statusCode": 200});
    });

    it("will generate expected response object with an expected body", () => {
      Lambda.generateResponse("Hello World", null)
        .should.deep.include({"body": "Hello World"});
    });
  });
});
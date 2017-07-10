"use strict";

class Lambda {
  static generateResponse(body, code){
    return {
        "isBase64Encoded": false,
        "statusCode": code,
        "headers": {
          "Access-Control-Allow-Origin": "*"
        },
        "body": body
    };
  }
}

module.exports = Lambda;
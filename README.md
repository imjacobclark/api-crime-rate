# UK Crime Rate API

A simple API that returns crime rates for a UK postcode or location.

### Endpoints

This project is designed to be deployed as a Lambda function via an API Gateway trigger. 

The API supports two ways of gathering crime data:

* By Postcode: /postcode/{date}/{postcode}
* By Place: /place/{date}/{place}

Postcode is the most accurate, by place (e.g "London" or "Manchester") attempts to locate the lat/long of a place - but it isn't 100% accurate. 

An example response might look like:

```json
{
  "crimes": [
    {
      "category": "anti-social-behaviour",
      "count": 663
    },
    {
      "category": "bicycle-theft",
      "count": 78
    },
    {
      "category": "burglary",
      "count": 72
    }
  ],
  "location": {
    "name": "Manchester",
    "postcode": "M2",
    "borough": "Manchester",
    "latitude": 53.4789436639108,
    "longitude": -2.24527828995083
  }
}
```

### Running on AWS

1) Install Python 3, Node.js 6.10 and Troposphere.

2) Update `deploy.sh` to match a bucket you have created in S3.

3) Ensure your aws cli `~/.aws/credentials` is configured with an IAM role that can create resources.

4) Run `./deploy.sh create`.

5) View the CloudFormation output for the URL to your newly created API.

### With thanks to

Thanks to [postcodes.io](http://postcodes.io/) for their postcode data - and of-course [data.police.uk](https://data.police.uk) for their free and open crime data.
# UK Crime Rate API

A simple API that returns crime rates for a UK postcode or location

### Endpoints

This project is designed to be deployed as a Lambda function via an API Gateway trigger. 

The API supports two ways of gathering crime data:

* By Postcode: /postcode/{date}/{postcode}
* By Place: /postcode/{date}/{place}

Postcode is the most accurate, by place (e.g "London" or "Manchester") attempts to locate the lat/long of a place - but it isn't 100% accurate. 

An example response might look like:

```json
[
  ["anti-social-behaviour",663],
  ["bicycle-theft",78],
  ["burglary",72]
]
```

### With thanks to

Thanks to [postcodes.io](http://postcodes.io/) for their postcode data - and of-course [data.police.uk](https://data.police.uk) for their free and open crime data.
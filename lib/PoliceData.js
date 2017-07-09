"use strict;"

const BASE_API_URL = "https://data.police.uk/api/";

class PoliceData {
  constructor(request){
    this.request = request;
  }

  allStreetCrime(date, lat, long){
    return this.request.get(BASE_API_URL + "crimes-street/all-crime?date=" + date + "&lat=" + lat +"&lng=" + long).then(crimes => {
      crimes = JSON.parse(crimes);
      
      return crimes.reduce((prev, crime) => {
        if(prev.has(crime.category)){
          prev.set(crime.category, prev.get(crime.category) + 1);
          return prev;
        }
          
        return prev.set(crime.category, 1);
      }, new Map());
    });
  }
}

module.exports = PoliceData;
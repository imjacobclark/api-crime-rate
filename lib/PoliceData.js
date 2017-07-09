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
        let current = prev.filter((item) => item.category === crime.category);

        if(current.length > 0){
          current[0].count = current[0].count + 1;
        }else{
          prev.push({
            "category": crime.category,
            "count": 1
          });
        }

        return prev;
      }, []);
    });
  }
}

module.exports = PoliceData;
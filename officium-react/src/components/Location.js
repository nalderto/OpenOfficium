import axios from 'axios';


function getLocationCoordinates(city){
  if(city.endsWith(", CA")){
    city = city.replace(", CA", ", California");
  }
  return axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: city,
      format: 'json',
    }
  });
}

function getDistance(lat1, lon1, lat2, lon2, validLocation){
  if(!validLocation){
    return new Promise(function(resolve, reject){
      resolve(false);
    });
  }
  var apiKey = process.env.REACT_APP_GRAPHHOPPPER_API;
  var params = new URLSearchParams();
  params.append('point',lat1+','+lon1)
  params.append('point',lat2+','+lon2)
  params.append('key', apiKey);
//  params.append('vehicle', 'car');
  params.append('locale', 'us');


  return axios.get("https://graphhopper.com/api/1/route", {
    params: params,
    validateStatus: function (status) {
      return status < 500; // Reject only if the status code is greater than or equal to 500
    }
  }).catch((error) => {
    console.log('woopsy');
  });
}

function inMiles(d){
  return d * .000621371;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function crowFlies(lat1, lon1, lat2, lon2){
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 0.621371;

}



export { getDistance, inMiles, crowFlies };
export default getLocationCoordinates;

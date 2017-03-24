$(document).ready(function() {

  var posLat = 0;
  var posLon = 0;
  var tempStr = "";
  var tempArray = [];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      posLat = position.coords.latitude;
      posLon = position.coords.longitude;
      // posLat = 42.46;
      // posLon = 14.21;
      var myLink = "http://api.openweathermap.org/data/2.5/weather?lat=" + posLat + "&lon=" + posLon + "&APPID=a6b37e083e59604c694202df5c440d9b";

      $.getJSON(myLink, function(obj){
        var myIconLink = "openweathermap.org/img/w/" + obj.weather[0].icon + ".png";
        $("#description").html(obj.weather[0].main);
        $("#descIcon").html("<img src= \'http://" + myIconLink + "\' />");
        $("#clouds").html("Clouds: " + obj.clouds.all + " %");

        if ((obj.weather[0].description === "rain") || (obj.weather[0].description === "shower rain") || (obj.weather[0].description === "thunderstorm")) {
          $(".source-image").attr("src", "https://static.pexels.com/photos/69927/rain-floor-water-wet-69927.jpeg");
        } else if (obj.weather[0].description === "snow") {
          $(".source-image").attr("src", "http://www.publicdomainpictures.net/pictures/70000/velka/snowy-night.jpg");
        } else {
          if ((obj.main.temp-273.15)<10) {
            $(".source-image").attr("src", "https://upload.wikimedia.org/wikipedia/commons/0/01/Crater_Lake_winter_pano2.jpg");
          } else if (((obj.main.temp-273.15)>9) && (((obj.main.temp-273.15)<20))) {
            $(".source-image").attr("src", "http://www.publicdomainpictures.net/pictures/30000/velka/spring-tree-1335342782YgV.jpg");
          } else if (((obj.main.temp-273.15)>19) && (((obj.main.temp-273.15)<30))) {
            $(".source-image").attr("src", "http://www.publicdomainpictures.net/pictures/70000/velka/wood-terrace-on-the-beach-and-sun-l.jpg");
          } else if ((obj.main.temp-273.15)>30) {
            $(".source-image").attr("src", "http://www.publicdomainpictures.net/pictures/190000/velka/desert-ruins-4.jpg");
          };
        };

        tempStr = "Temperature: " + (obj.main.temp-273.15).toFixed(2) + " &deg;C";
        tempArray = tempStr.split("");
        $("#temperature").html(tempStr);
        $("#wind").html("Wind: " + obj.wind.speed + " m/s");

        $("#toggleTemp").on("click", function(){
          if ((tempArray[tempArray.length-1]) === "C") {
            tempStr = "Temperature: " + ((obj.main.temp*9/5)-459.67).toFixed(2) + " &deg;F";
            tempArray = tempStr.split("");
            $("#temperature").html(tempStr);
            $("#toggleTemp").html(" &deg;C");
          } else {
            tempStr = "Temperature: " + (obj.main.temp-273.15).toFixed(2) + " &deg;C";
            tempArray = tempStr.split("");
            $("#temperature").html(tempStr);
            $("#toggleTemp").html(" &deg;F");
          }
        });
      });

      var myLinkGoogle = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + posLat + "," + posLon + "&key=AIzaSyAvjVBCxF8jVOkJj_Yi_MBRKsAVFO580iI";

      $.getJSON(myLinkGoogle, function(obj2){
        var myAddress = [];
        for (i = 0; i < obj2.results.length; i++) {
          myAddress[i] = obj2.results[i].formatted_address;
        }
        var found_city = false;
        for (var i = 0; i < obj2.results.length; i++) {
          for (var j = 0; j < obj2.results[i].address_components.length; j++) {
              for (var k = 0; k < obj2.results[i].address_components[j].types.length; k++) {
                  if (obj2.results[i].address_components[j].types[k] === 'locality') {
                      var city_name = obj2.results[i].address_components[j].long_name;
                      found_city = true;
                  };
              };
          };
        };
        if (!found_city) {
          $("#location").html("<h4>We couldn't retrieve your city's name :(<br></h4>" + myAddress[myAddress.length-2]);
        } else {
          $("#location").html(city_name + " - " + myAddress[myAddress.length-2]);
        };
      });
    });
  };
});

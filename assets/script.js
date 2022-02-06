var APIkey = "7149d24085fc99cfe92b53fad41fb72f";

var cityNameEl = document.querySelector("#city");
var cityFormEl = document.querySelector("#city-search");

var formSubmitHandler = function(event) {
    //prevents page from refreshing
    event.preventDefault();
    
    var city = cityNameEl.value.trim();

    if(city) {
        try {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`)
            .then(response=>response.json())
            .then(json=>{
                console.log(json);
                var lat = json.coord.lat;
                var lon = json.coord.lon;
                var name = json.name;
                try {
                    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIkey}&units=imperial`)
                    .then(response=>response.json())
                    .then(json=>{
                        console.log(json);
                        displayData(json,name);
                    });
                }catch(error)
                {
                    console.log(error);
                }
                
            });
        }catch(error)
        {
            console.log(error);        
        }
    }else {
        alert("Please enter a city");
    }
}

var displayData = function(object,cityName) {
    var temp;
    var date;
    var icon;
    var humidity;
    var windspd;
    var uvi = object.daily[0].uvi;
    $("#city-name").text(cityName);
    $("#uvi").text("UV Index: " + uvi);

    for(var i = 0; i < 6; i++)
    {
        tempMax = object.daily[i].temp.max;
        tempMin = object.daily[i].temp.min
        date = new Date(object.daily[i].dt*1000);
        icon = `http://openweathermap.org/img/wn/${object.daily[i].weather[0].icon}@2x.png`;
        humidity = object.daily[i].humidity;
        windspd = object.daily[i].wind_speed;

        $("#date"+i).text(date.toLocaleDateString("en-US"));
        $("#temp"+i).text("High: " + tempMax + "°F Low: " + tempMin + "°F" );
        $("#icon"+i).attr("src",icon);
        $("#humidity"+i).text("Humidity: " + humidity + "%");
        $("#windspd"+i).text("Wind Speed: " + windspd + "mph");
    }
}
cityFormEl.addEventListener("submit",formSubmitHandler);
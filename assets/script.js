var APIkey = "7149d24085fc99cfe92b53fad41fb72f";

var cityNameEl = document.querySelector("#city");
var cityFormEl = document.querySelector("#city-search");

var searchHistory = [];

//Handles search input
var formSubmitHandler = function(event) {
    //prevents page from refreshing
    event.preventDefault();
    
    var city = cityNameEl.value.trim();

    if(city) {
        cityNameEl.value = "";
        addToHistory(city);
        fetchData(city);
    }else {
        alert("Please enter a city");
    }
}

//adds new search to the history array
var addToHistory = function(city) {
    if(searchHistory.length > 1)
    {
        for(var i = searchHistory.length-1; i >= 0; i--)
        {
            //move search history down, limit to 10
            searchHistory[i+1] = searchHistory[i];
        }
        searchHistory[0] = city;

        if(searchHistory.length > 10)
        {
            searchHistory[10] = null;
        }
    }else{
        searchHistory[1] = searchHistory[0];
        searchHistory[0] = city;
    }

    //saves updated history to local storage
    for(var i = 0; i < searchHistory.length; i++)
    {
        if(searchHistory[i] == null){
            localStorage.removeItem(i);
        }else {
        localStorage.setItem(i,searchHistory[i]);
        }
    }

    displayHistory();

}

//displays search history
var displayHistory = function() {
    for(var i = 0; i < 10; i++)
    {
        if(searchHistory[i]==null)
        {
            $("#hist"+i).css("visibility","hidden");
        }else{
            $("#hist"+i).text(searchHistory[i]);
            $("#hist"+i).css("visibility","visible");
        }
    }
}

//loads history from local storage
//called on page load only
var loadHistory = function() {
    if(localStorage.getItem(0) == null)
    {
        localStorage.setItem(0,"Lawrence");
        searchHistory[0] = "Lawrence";
        fetchData("Lawrence");
    }else {
        for(var i = 0; i < 10; i++)
        {
            searchHistory[i] = localStorage.getItem(i);
        }
        console.log(searchHistory);
        fetchData(searchHistory[0]);
    }
    displayHistory();
}

//fetches data from open weather API about city
var fetchData = function(city) {
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
}

//displays data from JSON city object to weather dashboard
var displayData = function(object,cityName) {
    var temp;
    var date;
    var icon;
    var humidity;
    var windspd;
    var uvi = object.daily[0].uvi;
    $("#city-name").text(cityName);
    $("#uvi span").text(uvi);

    var currentSpanClass = $("#uvi span").attr("class");

    if(uvi >= 8)
    {
        $("#uvi span").attr("class","p-1 bg-danger");
    }else if(uvi >= 3)
    {
        $("#uvi span").attr("class","p-1 bg-warning");
    }else 
    {
        $("#uvi span").attr("class","p-1 bg-success");
    }

    for(var i = 0; i < 6; i++)
    {
        tempMax = object.daily[i].temp.max;
        tempMin = object.daily[i].temp.min
        date = new Date(object.daily[i].dt*1000);
        icon = `http://openweathermap.org/img/wn/${object.daily[i].weather[0].icon}@2x.png`;
        humidity = object.daily[i].humidity;
        windspd = object.daily[i].wind_speed;

        $("#date"+i).text(date.toLocaleDateString("en-US"));
        $("#temp"+i).text("High/Low: " + tempMax + "°F/" + tempMin + "°F" );
        $("#icon"+i).attr("src",icon);
        $("#humidity"+i).text("Humidity: " + humidity + "%");
        $("#windspd"+i).text("Wind Speed: " + windspd + "mph");
    }
}

$(".search-history").on("click","button",function() {
    fetchData($(this).text());
});

loadHistory();
cityFormEl.addEventListener("submit",formSubmitHandler);
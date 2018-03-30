//Document ready function
$(function() {

	//get JSON data
	$.getJSON('bikeshare.json', loadData);
	

}) //End of document ready

var jsonData; //global var

function loadData(data){
	jsonData = data.stationBeanList;

	var stationList = data.stationBeanList;
	//loop through all the data and 

	stationList.forEach(element => {
		console.log(element.totalDocks);
		
		//Assume larger groups require more than 15 docks

		if(element.totalDocks > 15) {
			$("ul#largerGroupInformation").append(
				"<li li-id='"+element.id+"'>" +
					"<a href='#moreDetails'>  " +
						"<h3>" + element.id + " - " + element.stationName + " </h3>" +
					"</a>" +
				"</li>");
		}
		
	});

	$("ul#largerGroupInformation").listview("refresh");
	

	//console.log(stationList);


}


//Display location details
$(document).on("pageshow", "#moreDetails", function() {
	//clear the table
	$("#extraInfo").html("");

	rowid  = localStorage.getItem("rowid");
	//fetch data with a specific id
	jsonData.forEach(d => {
		if(d.id == rowid){
			$("#extraInfo").append(
			"<tr>" +
				"<th> Station Name</th> " +
				" <td> " + d.stationName + "</td>" +
			"</tr>" +
			"<tr>" +
				"<th> Available Docks</th> " +
				" <td> " + d.availableDocks + "</td>" +
			"</tr>" +
			"<tr>" +
				"<th> Total Docks</th> " +
				" <td> " + d.totalDocks + "</td>" +
			"</tr>" +
			"<tr>" +
				"<th>Location Status</th> " +
				" <td> " + d.statusValue + "</td>" +
			"</tr>" +
			"<tr>" +
				"<th> Available Bikes</th> " +
				" <td> " + d.availableBikes + "</td>" +
			"</tr>" +
			"<tr>" +
				"<th> Address</th> " +
				" <td> " + "address here" + "</td>" +
			"</tr>" 
			);

		}
	
	});

})



//Save row key in a local storage to pass it to the next page
$(document).on("click", "#largerGroupInformation >li", function() {
	rowid = $(this).closest("li").attr("li-id");
        localStorage.setItem("rowid", $(this).closest("li").attr("li-id"));
});


//display map
var lat = 43.656246;
var lng = -79.739509;

$(document).on("pageshow", "#availDocks", function() {
	if (navigator.geolocation){
		//lat = 43.66207;
		//lng = -80.37617;

		navigator.geolocation.getCurrentPosition(pos => {
			lat = pos.coords.latitude;
			lng = pos.coords.longitude;
		});

		drawMap(lat,lng);
	}
	else {
		alert("Geolocation not supported"); 
	}

});

// draw map
function drawMap(lat,lng) 
{
	var mapOptions = 
		{
			center: new google.maps.LatLng( lat, lng ), zoom: 15,   
						mapTypeId: google.maps.MapTypeId.ROADMAP   
		};

	var map = new google.maps.Map($("#map_canvas")[0],mapOptions);

	//symbol representing current location
	var lineSymbol = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 8,
		strokeColor: '#393'
	};

	var myMarker = new google.maps.Marker ({
		map: map,animation: google.maps.Animation.DROP,
		icon: lineSymbol,
		position: new google.maps.LatLng(lat, lng)
	});

	var geocoder = new google.maps.Geocoder();

	var info = new google.maps.InfoWindow ( {content: "My current location", maxWidth: 150  } );

	google.maps.event.addListener(myMarker, "click", function() {info.open(map, myMarker);});

	geocoder.geocode({"latLng":new google.maps.LatLng(lat, lng)},function(data,status) {
		if(data != null) {
			info.setContent(data[0].formatted_address);
		}
	});

	jsonData.forEach(l => {
		if(l.availableDocks > 20){
			var aMarker = new google.maps.Marker ({
				map: map,animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(l.latitude, l.longitude)
			});
		
			var aInfo = new google.maps.InfoWindow ( 
				{content: l.stationName + " has " + l.availableDocks + " available docks", maxWidth: 150  } 
			);
			
			google.maps.event.addListener(aMarker, "click", function() {aInfo.open(map, aMarker);});

			//formatting address
			geocoder.geocode(
				{"latLng":new google.maps.LatLng(l.latitude, l.longitude)},function(adata,status) {
					if(adata != null){
						aInfo.setContent(adata[0].formatted_address + " Available docks: " + l.availableDocks);
					}
			}); 
			
		}
	});

}

//success
function success(pos)
{
	lat = pos.coords.latitude;
	lng = pos.coords.longitude;
//	alert(lat + " " + lng);
//	drawMap(lat,lng)
	alert("Hi");
};
		
//error
function error(err) {
	if (err.code == 1) {
		alert("Permission denied");
	} else if (err.code == 2) {
		alert("Error")
	}
};

function initMap(){
	alert("yp");
}

//add multiple markers
function addMarkers(){

	jsonData.forEach(l => {
		if(l.availableDocks > 0){
			var aMarker = new google.maps.Marker ({
				map: map,animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(l.latitude, l.longitude)
			});
		
			var ainfo = new google.maps.InfoWindow ( 
				{content: "Available Docks" + l.availableDocks, maxWidth: 150  } 
			);
			
			google.maps.event.addListener(aMarker, "click", function() {info.open(map, aMarker);});
		}

//		console.log(l.stationName + " " + l.latitude + " " + l.longitude);
	});


}


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
$(document).on("pageshow", "#availDocks", function() {
	if (navigator.geolocation){
		lat = 43.66207;
		lng = -79.37617;
		// navigator.geolocation.getCurrentPosition(success,error);
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
			center: new google.maps.LatLng( lat, lng ), zoom: 12,   
						mapTypeId: google.maps.MapTypeId.ROADMAP   
		};
	var map = new google.maps.Map($("#map_canvas")[0],mapOptions);

	var myMarker = new google.maps.Marker ({
		map: map,animation: google.maps.Animation.DROP,
		position: new google.maps.LatLng(lat, lng)
	});
		
	var info = new google.maps.InfoWindow ( {content: "My current location", maxWidth: 150  } );
	
	google.maps.event.addListener(myMarker, "click", function() {info.open(map, myMarker);});
	
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({"latLng":new google.maps.LatLng(lat, lng)},function(data,status) {
		info.setContent(data[0].formatted_address);
	});
	
	/*
	var MajorCities = [ 
		new google.maps.LatLng(43.653226,-79.38318429999998),
		new google.maps.LatLng(43.7764258, -79.2317521),
		new google.maps.LatLng(43.5890452,-79.6441198)
	];
	
	var majorCitiesRoute = new google.maps.Polyline( {path: MajorCities,strokeColor: "#FF0000",strokeWeight: 2 });      majorCitiesRoute.setMap(map);
	
	majorCitiesRoute.addListener('click',showMarker);
	function showMarker(event) 
	{
		var myMarker = new google.maps.Marker({map: map,animation: google.maps.Animation.DROP,position: event.latLng }); 
		var info = new google.maps.InfoWindow ({ maxWidth: 150 } );
		google.maps.event.addListener(myMarker,"click",function(event){
			var lat = event.latLng.lat();
			var lng = event.latLng.lng();
			geocoder.geocode({"latLng":new google.maps.LatLng(lat, lng)}, 
							 function(data,status){
								info.setContent(data[0].formatted_address);});
								info.open(map, myMarker);   
			});
	}
	
	var polyline = new google.maps.Polyline({
		strokeColor: "#FF0000",strokeWeight: 2 
		});
	polyline.setMap(map);
	map.addListener('click', addLatLng);
	function addLatLng(event) 
	{
		var path = polyline.getPath();
		path.push(event.latLng);
		var marker = new google.maps.Marker({
			position: event.latLng,title: '#' + path.getLength(),map: map
		});
		
		var info = new google.maps.InfoWindow ({
			maxWidth: 150});
		google.maps.event.addListener(marker, "click", function(){
			info.open(map, marker);
			lat = marker.getPosition().lat();
			lng = marker.getPosition().lng();
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({"latLng":new google.maps.LatLng(lat,lng)},function(data,status) {info.setContent(data[0].formatted_address);                                     
			});
		});
	}*/

}

//success
function success(pos)
{
	lat = pos.coords.latitude;
	lng = pos.coords.longitude;
	alert(lat + " " + lng);
	drawMap(lat,lng)
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
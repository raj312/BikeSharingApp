//global vars
var jsonData; 
var groupNumber;
var lat = 43.656246;
var lng = -79.739509;
var distanceInput = 30.599;

//after the dom(body) has loaded
function init(){
	document.addEventListener("deviceready", onDeviceReady, true);
}

//Document ready function
$(function() {
	//get JSON data
	$.getJSON('bikeshare.json', loadData)
	.fail(function() {
		alert("Failed to load JSON");
	  });
	groupNumber = $("#groupNum").val();
	//user changes value and hits search
	$("#searchBtn").click(function(){
		groupNumber = $("#groupNum").val();
		updateList(groupNumber);
	});

	//get current location
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(pos => {
			lat = pos.coords.latitude;
			lng = pos.coords.longitude;
		});
	}

	//user inputs distance and hits find
	$("#findBtn").click(function(){
		distanceInput = $("#distanceInput").val();
		drawMap(lat, lng);
	});

}) //End of document ready

function loadData(data){
	jsonData = data.stationBeanList;
	updateList(groupNumber);
}

function updateList(groupNumber){
	$("ul#largerGroupInformation").html("");
	var stationList = jsonData;
	//loop through all the data and 
	if(groupNumber == null || groupNumber < 0){
		alert("Enter a valid input. Should be greater than 0");
	}else{
		stationList.forEach(element => {
			//Assume larger groups require 15 or more docks
			if(element.totalDocks >= groupNumber) {
				$("ul#largerGroupInformation").append(
					"<li li-id='"+element.id+"'>" +
						"<a href='#moreDetails'>  " +
							"<h3>" + element.id + " - " + element.stationName + " </h3>" +
						"</a>" +
					"</li>");
			}	
		});
	}
	$("ul#largerGroupInformation").listview("refresh");
}

//Display location details
$(document).on("pageshow", "#moreDetails", function() {
	//clear the table
	$("#extraInfo").html("");
	rowid  = localStorage.getItem("rowid");
	
	//fetch data with a specific id
	jsonData.forEach(d => {
		if(d.id == rowid){
			var addressInformation = "address goes here";
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
			"</tr>" 
			);

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{"latLng":new google.maps.LatLng(d.latitude, d.longitude)},function(bdata,status) {
					if(bdata != null){
						addressInformation = bdata[0].formatted_address;
						$("#extraInfo").append("<tr><th> Address</th> " +
							" <td> " + addressInformation + "</td>" +
							"</tr>" 
						);
					}
			});
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
			center: new google.maps.LatLng( lat, lng ), zoom: 10,   
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

	var distance;
	jsonData.forEach(l => {
		distance = Haversine(lat, lng, l.latitude, l.longitude);
		if(l.availableDocks > 0 && distance < distanceInput){
			var aMarker = new google.maps.Marker ({
				map: map,animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(l.latitude, l.longitude)
			});
		
			var aInfo = new google.maps.InfoWindow ( 
				{content: l.stationName + " has " + l.availableDocks + 
				" available docks. Distance: " + distance, maxWidth: 150  } 
			);
			google.maps.event.addListener(aMarker, "click", function() {aInfo.open(map, aMarker);});
			//formatting address
			geocoder.geocode(
				{"latLng":new google.maps.LatLng(l.latitude, l.longitude)},function(adata,status) {
					if(adata != null){
						aInfo.setContent(adata[0].formatted_address + 
							" Available docks: " + l.availableDocks + " Distance: " + distance);
					}
			}); 
		}
	});
}

//get distance in kilometers
function Haversine( lat1, lng1, lat2, lng2 ) {
	var R = 6372.8; // Earth Radius in Kilometers
	var dLat = Deg2Rad(lat2-lat1); 
	var dLng = Deg2Rad(lng2-lng1);  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) * Math.sin(dLng/2) * Math.sin(dLng/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	// Return Distance in Kilometers
	return d;
};

function Deg2Rad( deg ) { 
	return deg * Math.PI / 180; 
}  


//add image capture fucntions
function onDeviceReady() {
//	alert("hi");
	document.getElementById("imageBtn").addEventListener("click", function() {
		_type = "image";
		navigator.device.capture.captureImage(captureSuccess,captureError, {limit:1});
		//capture just one image
	});
	
	var captureSuccess = function(mediaFiles) {
		var i, path, len;
			//		for (i= 0, len= mediaFiles.length; i< len; i+= 1) {
		path = mediaFiles[0].fullPath;
			// do something interesting with the file
			//		}
		alert(path);
		$("#myImage").attr("src",path);
	}

	var captureError = function(){
		alert("Error");
	}
}
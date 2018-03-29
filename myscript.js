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


//update a customer
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
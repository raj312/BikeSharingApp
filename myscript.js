//Document ready function
$(function() {

	//get JSON data
	$.getJSON('bikeshare.json', loadData);
	

}) //End of document ready

function loadData(data){
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
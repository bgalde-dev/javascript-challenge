// from data.js
// ##########################################
// #             INITIAL STATE              #
// ##########################################
var tableData = data;
var cleanedData = cleanData(tableData);

// Get the table body element
var tbody = d3.select("tbody");

console.log(tableData);
console.log(cleanedData);

addTableData(tbody, cleanedData);



// ##########################################
// #              FUNCTIONS                 #
// ##########################################

// Change a string to title case for city names.
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Clean the data so it looks nice
function cleanData(dirtyData) {
    return dirtyData.map(sighting => {
        return {
            datetime: new Date(sighting.datetime.toString()),
            city: toTitleCase(sighting.city.toString()),
            state: sighting.state.toString().toUpperCase(),
            country: sighting.country.toString().toUpperCase(),
            shape: toTitleCase(sighting.shape.toString()),
            durationMinutes: sighting.durationMinutes,
            comments: sighting.comments
        };
    });
}

// Add the data to the table in the HTML
function addTableData(element, dataList) {
    // Clear all the data first from the table body
    element.html("");

    // Add rows
    dataList.forEach(sighting => {
        var row = element.append("tr");
        Object.entries(sighting).forEach(([key, value]) => {
            // Format the date value
            value = key === "datetime" ? value.toDateString() : value.toString();            
            var cell = row.append("td");
            cell.text(value);
        });
    });
}


// ##########################################
// #                 FORM                   #
// ##########################################

// Select the button
var button = d3.select("#filter-btn");

// Select the form
var form = d3.select("#filter-form");

// Create event handlers for clicking the button or pressing the enter key
button.on("click", runEnter);
form.on("submit", runEnter);

// Create the function to run for both events
function runEnter() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // No filters
    filteredTableData = cleanedData

    // Select the input elements and get the raw HTML node
    var startDate = d3.select("#filter-start-date");
    var endDate = d3.select("#filter-end-date");
    var city = d3.select("#filter-city");
    var country = d3.select("#filter-country");
    var shape = d3.select("#filter-shape");

    // Get the value property of the input elements, vaildate and filter
    var startDateVal = new Date(startDate.property("value"));
    var endDateVal = new Date(endDate.property("value"));
    
    filteredTableData = cleanedData.filter(sighting => sighting.datetime >= startDateVal);

    var cityeVal = city.property("value");
    var countryeVal = country.property("value");
    var shapeVal = shape.property("value");

    // Print the values to the console
    console.log(startDateVal);
    console.log(endDateVal);
    console.log(cityeVal);
    console.log(countryeVal);
    console.log(shapeVal);

    // FILTER THE DATA
    var tbody = d3.select("tbody");


    addTableData(tbody, filteredTableData);
}
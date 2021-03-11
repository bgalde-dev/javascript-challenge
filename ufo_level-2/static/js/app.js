 // from data.js
// ##########################################
// #             INITIAL STATE              #
// ##########################################
var tableData = data;
var cleanedData = cleanData(tableData);

// Get the table body element
var tbody = d3.select("tbody");
const cities = new Set();
const countries = new Set();
const shapes = new Set();
createDropDowns(cleanedData);
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

function createDropDowns(data) {
    data.forEach(element => {
        cities.add(element.city);
        countries.add(element.country);
        shapes.add(element.shape);
    });
    console.log(Array.from(cities).sort() );
    console.log(Array.from(countries).sort() );
    console.log(Array.from(shapes).sort() );
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
    var filteredTableData = cleanedData;

    // Select the input elements and get the raw HTML node
    var startDate = d3.select("#filter-start-date");
    var endDate = d3.select("#filter-end-date");
    var city = d3.select("#filter-city");
    var country = d3.select("#filter-country");
    var shape = d3.select("#filter-shape");

    // Get the value property of the input elements, vaildate and filter
    var startDateVal = new Date(startDate.property("value"));
    var endDateVal = new Date(endDate.property("value"));
    var cityVal = city.property("value").toUpperCase();
    var countryVal = country.property("value").toUpperCase();
    var shapeVal = shape.property("value").toUpperCase();   
    console.log(startDateVal);
    console.log(endDateVal);
    console.log(cityVal);
    console.log(countryVal);
    console.log(shapeVal);

    if (shapeVal) {
        console.log("shapeVal is true");
    } else {
        console.log("shapeVal is false");
    }

    filteredTableData = startDateVal ? cleanedData.filter(sighting => sighting.datetime.getTime() >= startDateVal.getTime()) : filteredTableData;
    console.log(filteredTableData);
    filteredTableData = endDateVal ? cleanedData.filter(sighting => sighting.datetime.getTime() <= endDateVal.getTime()) : filteredTableData;
    console.log(filteredTableData);
    filteredTableData = cityVal ? cleanedData.filter(sighting => sighting.city.toUpperCase() >= cityVal) : filteredTableData;
    console.log(filteredTableData);
    filteredTableData = countryVal ? cleanedData.filter(sighting => sighting.country.toUpperCase() === countryVal) : filteredTableData;
    console.log(filteredTableData);
    filteredTableData = shapeVal ? cleanedData.filter(sighting => sighting.shape.toUpperCase() === shapeVal) : filteredTableData;
    console.log(filteredTableData);

    // Print the values to the console


    addTableData(tbody, filteredTableData);
}
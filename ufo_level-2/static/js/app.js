// ##########################################
// #             INITIAL STATE              #
// ##########################################

// Raw data from data.js
var tableData = data;

// Clean up data to make it pretty
var cleanedData = cleanData(tableData);

// Get the table body element
var tbody = d3.select("tbody");

// Get the data for the drop downs. Used Sets so there are no dups.
const cities = new Set([""]);
const states = new Set([""]);
const countries = new Set([""]);
const shapes = new Set([""]);

// Populate the data for the drop downs.
cleanedData.forEach(element => {
    cities.add(element.city);
    states.add(element.state);
    countries.add(element.country);
    shapes.add(element.shape);
});

// Create the drop doen menus
var selectFilters = ['city', 'state', 'country', 'shape'];
selectFilters.forEach(element => {
    createDropDown(element);
});


// Create the inital table with all data.
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

// Creates a single dropdown menu base on a given string
function createDropDown(element) {
    var mySelect = document.getElementById("filter-" + element);
    var myArray = [];
    switch (element) {
        case "city":
            myArray = Array.from(cities).sort();
            break;
        case "state":
            myArray = Array.from(states).sort();
            break;
        case "country":
            myArray = Array.from(countries).sort();
            break;
        case "shape":
            myArray = Array.from(shapes).sort();
            break;
        default:
            break;
    }

    for (var i = 0; i < myArray.length; i++) {
        var option = document.createElement("option");
        option.text = myArray[i];
        option.value = myArray[i];
        mySelect.appendChild(option);
    }
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
var filterButton = d3.select("#filter-btn");
var resetButton = d3.select("#reset-btn");

// Select the form
var form = d3.select("#filter-form");

// Create event handlers for clicking the button or pressing the enter key
filterButton.on("click", runEnter);
form.on("submit", runEnter);
resetButton.on("click", resetForm);

// Resets all the filters
function resetForm() {
    document.getElementById("filter-form").reset();
    runEnter();
 }

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
    var state = d3.select("#filter-state");
    var country = d3.select("#filter-country");
    var shape = d3.select("#filter-shape");

    // Get the value property of the input elements, vaildate and filter
    var startDateVal = startDate.property("value") ? new Date(startDate.property("value")) : false;
    var endDateVal = endDate.property("value") ? new Date(endDate.property("value")) : false;
    var cityVal = city.property("value").toUpperCase();
    var stateVal = state.property("value").toUpperCase();
    var countryVal = country.property("value").toUpperCase();
    var shapeVal = shape.property("value").toUpperCase();

    filteredTableData = startDateVal ? filteredTableData.filter(sighting => sighting.datetime.getTime() >= startDateVal.getTime()) : filteredTableData;
    filteredTableData = endDateVal ? filteredTableData.filter(sighting => sighting.datetime.getTime() <= endDateVal.getTime()) : filteredTableData;
    filteredTableData = cityVal ? filteredTableData.filter(sighting => sighting.city.toUpperCase() === cityVal) : filteredTableData;
    filteredTableData = stateVal ? filteredTableData.filter(sighting => sighting.state.toUpperCase() === stateVal) : filteredTableData;
    filteredTableData = countryVal ? filteredTableData.filter(sighting => sighting.country.toUpperCase() === countryVal) : filteredTableData;
    filteredTableData = shapeVal ? filteredTableData.filter(sighting => sighting.shape.toUpperCase() === shapeVal) : filteredTableData;

    addTableData(tbody, filteredTableData);
}
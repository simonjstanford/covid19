d3.queue()
  .defer(d3.json, './50m.json')
  .defer(d3.json, './timeseries.json') //from https://pomber.github.io/covid19/timeseries.json
  .await(renderMap);

  function renderMap(error, mapData, infectionData) {
    if (error) throw error;
    
    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    addDataToMap(infectionData, geoData);

    var width = 960;
    var height = 600;

    var path = createMapPath(width, height);
    renderData(geoData, path, width, height);

    var maxDay = infectionData["US"].length;
    var currentDay = 1;
    setInterval(() => {
        if (currentDay < maxDay) {
            d3.select("h2").text("Day " + currentDay);
            setColour(currentDay, infectionData);
            currentDay +=1;
        } else {
            clearInterval();
        }
    }, 100);
 }

function addDataToMap(infectionData, geoData) {
    const entries = Object.entries(infectionData);

    entries.forEach(entry => {
        var countryCode = countryDictionary[entry[0]];
        var countries = geoData.filter(d => d.id === countryCode);
        countries.forEach(country => country.properties = entry[1]);
    });
}

function createMapPath(width, height) {
    var projection = d3.geoMercator()
        .scale(125)
        .translate([width / 2, height / 1.4]);
    var path = d3.geoPath().projection(projection);
    return path;
}

function renderData(geoData, path, width, height) {   
    d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .selectAll(".country")
        .data(geoData)
        .enter()
        .append("path")
        .classed("country", true)
        .attr("d", path)
        .attr("fill", "white");
}

function getSelectControl() {
    return d3.select("input");
}

function setColour(dayNumber, infectionData) {
    var colourRange = ["#ff5733", "#511845"];

    var scale = d3.scaleLog()
                  .domain([0, 250000])
                  .range(colourRange);

    d3.selectAll(".country")
         .transition()
         .duration(50)
         .ease(d3.easeBackIn)
         .attr("fill", d => {
             var data = d.properties[+dayNumber];
             if (data) {
                var confirmed = data.confirmed;
                var recovered = data.recovered;
                var deaths = data.deaths;
                var active = confirmed - recovered - deaths;

                if (active === 0) {
                    return "white";
                } else if (active < 100) {
                    return "#ffd868";
                } else if (active < 1000) {
                    return "#f8615a";
                } else if (active < 10000) {
                    return "#b80d57";
                } else if (active < 100000) {
                    return "#721b65";
                } else {
                    return "#202040";
                }
             } else {
                 return "#ccc";
             }
         });
}


var countryDictionary = {
    "Afghanistan": "004",
    "Albania": "008",
    "Algeria": "012",
    "American Samoa": "016",
    "Andorra": "020",
    "Angola": "024",
    "Anguilla": "660",
    "Antigua and Barbuda": "028",
    "Argentina": "032",
    "Armenia": "051",
    "Aruba": "553",
    "Australia": "036",
    "Austria": "040",
    "Azerbaijan": "031",
    "Bahamas": "044",
    "Bahrain": "048",
    "Bangladesh": "050",
    "Barbados": "052",
    "Belarus": "112",
    "Belgium": "056",
    "Belize": "084",
    "Benin": "204",
    "Bermuda": "060",
    "Bhutan": "064",
    "Bolivia": "068",
    "Bosnia and Herzegovina": "070",
    "Botswana": "072",
    "Brazil": "076",
    "British Virgin Islands": "092",
    "Brunei": "096",
    "Bulgaria": "100",
    "Burkina Faso": "854",
    "Burundi": "108",
    "Burma": "104",
    "Cabo Verde": "132",
    "Cambodia": "116",
    "Cameroon": "120",
    "Canada": "124",
    "Cayman Islands": "136",
    "Central African Republic": "140",
    "Chad": "148",
    "Chile": "152",
    "China": "156",
    "Colombia": "170",
    "Comoros": "174",
    "Congo": "178",
    "Cook Islands": "184",
    "Costa Rica": "188",
    "Cote d'Ivoire": "384",
    "Croatia": "191",
    "Cuba": "192",
    "CuraÃ§ao": "530",
    "Cyprus": "196",
    "Czechia": "203",
    "Denmark": "208",
    "Djibouti": "262",
    "Dominica": "212",
    "Dominican Republic": "214",
    "DR Congo": "180",
    "Ecuador": "218",
    "Egypt": "818",
    "El Salvador": "222",
    "Equatorial Guinea": "226",
    "Eritrea": "232",
    "Estonia": "233",
    "Ethiopia": "231",
    "Faeroe Islands": "234",
    "Falkland Islands": "238",
    "Fiji": "242",
    "Finland": "246",
    "France": "250",
    "French Guiana": "254",
    "French Polynesia": "258",
    "Gabon": "266",
    "Gambia": "270",
    "Georgia": "268",
    "Germany": "276",
    "Ghana": "288",
    "Greece": "300",
    "Greenland": "304",
    "Grenada": "308",
    "Guadeloupe": "312",
    "Guam": "316",
    "Guatemala": "320",
    "Guinea": "324",
    "Guinea-Bissau": "624",
    "Guyana": "328",
    "Haiti": "332",
    "Holy See": "336",
    "Honduras": "340",
    "Hungary": "348",
    "Iceland": "352",
    "India": "356",
    "Indonesia": "360",
    "Iran": "364",
    "Iraq": "368",
    "Ireland": "372",
    "Isle of Man": "833",
    "Israel": "376",
    "Italy": "380",
    "Jamaica": "388",
    "Japan": "392",
    "Jordan": "400",
    "Kazakhstan": "398",
    "Kenya": "404",
    "Kiribati": "296",
    "Kuwait": "414",
    "Kyrgyzstan": "417",
    "Laos": "418",
    "Latvia": "428",
    "Lebanon": "422",
    "Lesotho": "426",
    "Liberia": "430",
    "Libya": "434",
    "Liechtenstein": "438",
    "Lithuania": "440",
    "Luxembourg": "442",
    "Madagascar": "450",
    "North Macedonia": "807",
    "Malawi": "454",
    "Malaysia": "458",
    "Maldives": "462",
    "Mali": "466",
    "Malta": "470",
    "Marshall Islands": "584",
    "Martinique": "474",
    "Mauritania": "478",
    "Mauritius": "480",
    "Mayotte": "175",
    "Mexico": "484",
    "Micronesia": "583",
    "Moldova": "498",
    "Mongolia": "496",
    "Montenegro": "499",
    "Montserrat": "500",
    "Monaco": "492",
    "Morocco": "504",
    "Mozambique": "508",
    "Myanmar": "104",
    "Namibia": "516",
    "Nauru": "520",
    "Nepal": "524",
    "Netherlands": "528",
    "New Caledonia": "540",
    "New Zealand": "554",
    "Nicaragua": "558",
    "Niger": "562",
    "Nigeria": "566",
    "Niue": "570",
    "North Korea": "408",
    "Northern Mariana Islands": "580",
    "Norway": "578",
    "Oman": "512",
    "Pakistan": "586",
    "Palau": "585",
    "Panama": "591",
    "Papua New Guinea": "598",
    "Paraguay": "600",
    "Peru": "604",
    "Philippines": "608",
    "Poland": "616",
    "Portugal": "620",
    "Puerto Rico": "630",
    "Qatar": "634",
    "RÃ©union": "638",
    "Romania": "642",
    "Russia": "643",
    "Rwanda": "646",
    "Saint Helena": "654",
    "Saint Kitts and Nevis": "659",
    "Saint Lucia": "662",
    "Saint Pierre and Miquelon": "666",
    "Saint Vincent and the Grenadines": "670",
    "Samoa": "882",
    "San Marino": "674",
    "Sao Tome and Principe": "678",
    "Saudi Arabia": "682",
    "Senegal": "686",
    "Serbia": "688",
    "Seychelles": "690",
    "Sierra Leone": "694",
    "Singapore": "702",
    "Slovakia": "703",
    "Slovenia": "705",
    "Solomon Islands": "090",
    "Somalia": "706",
    "South Africa": "710",
    "Korea, South": "410",
    "South Sudan": "728",
    "Spain": "724",
    "Sri Lanka": "144",
    "St. Vincent & Grenadines": "670",
    "State of Palestine": "275",
    "Sudan": "729",
    "Suriname": "740",
    "Eswatini": "748",
    "Sweden": "752",
    "Switzerland": "756",
    "Syria": "760",
    "Taiwan*": "158",
    "Tajikistan": "762",
    "Tanzania": "834",
    "TFYR Macedonia": "807",
    "Thailand": "764",
    "Timor-Leste": "626",
    "Togo": "768",
    "Tokelau": "772",
    "Tonga": "776",
    "Trinidad and Tobago": "780",
    "Tunisia": "788",
    "Turkey": "792",
    "Turkmenistan": "795",
    "Turks and Caicos Islands": "796",
    "Tuvalu": "798",
    "United Kingdom": "826",
    "US": "840",
    "Uganda": "800",
    "Ukraine": "804",
    "United Arab Emirates": "784",
    "United States Virgin Islands": "850",
    "Uruguay": "858",
    "Uzbekistan": "860",
    "Vanuatu": "548",
    "Venezuela": "862",
    "Vietnam": "704",
    "Wallis and Futuna": "876",
    "Western Sahara": "732",
    "West Bank and Gaza": "274",
    "Yemen": "887",
    "Zambia": "894",
    "Zimbabwe": "716"
}

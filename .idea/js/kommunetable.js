import { fetchAnyUrl, restDelete, fetchRegioner } from "./modulejson.js";

let regMap = new Map()

console.log("er i kommunetable");

const urlKommune = "http://localhost:8080/kommuner";
const pbCreateKommuneTable = document.getElementById("pbGetKommuner");
const tblKommuner = document.getElementById("tblKommuner");
const pbSortKommuneTable = document.getElementById("pbSortKommuner"); // The Sort button

let kommuner = [];
let displayedKommuneCodes = new Set();

async function fetchKommuner() {
    try {
        regMap = await fetchRegioner(); // Sørger for at regionMap er fyldt før kommuner hentes
        console.log("Efter fetchRegioner(), regionMap:", Array.from(regMap.entries()));

        if (regMap.size === 0) {
            console.error("Fejl: regionMap er stadig tom efter fetchRegioner()!");
        return;
        }

        const urlKommune = "http://localhost:8080/kommuner";
        kommuner = await fetchAnyUrl(urlKommune);
        console.log("Hentede kommuner:", kommuner);

        if (kommuner) {
            tblKommuner.innerHTML = `
                <tr>
                    <th>Kode</th>
                    <th>Navn</th>
                    <th>Href</th>
                    <th>Region Kode</th>
                    <th>Region Navn</th>
                </tr>
            `;

            kommuner.forEach(createTable);
        } else {
            alert("Fejl ved kald til backend url=" + urlKommune + " vil du vide mere så kig i Console");
        }
    } catch (error) {
        console.error("Error fetching kommuner:", error);
    }
}



// Separate function for sorting kommuner
function sortKommuner(arr) {
    arr.sort((a, b) => {
        if (a.region.kode !== b.region.kode) {
            return a.region.kode > b.region.kode ? 1 : -1;
        }
        return a.navn > b.navn ? 1 : -1;
    });
}

// Function to sort and update the table
function sortAndDisplayKommuner() {
    sortKommuner(kommuner); // Sort the kommuner array
    // Clear existing rows
    tblKommuner.innerHTML = `
        <tr>
            <th>Kode</th>
            <th>Navn</th>
            <th>Href</th>
            <th>Region Kode</th>
            <th>Region Navn</th>
        </tr>
    `;
    // Recreate the table rows after sorting
    kommuner.forEach(createTable);
}

// Create table rows for each kommune
function createTable(kommune) {
    let cellCount = 0;
    let rowCount = tblKommuner.rows.length;
    let row = tblKommuner.insertRow(rowCount);
    let cell = row.insertCell(cellCount++);


    console.log("Region map i createTable()", Array.from(regMap.entries()));


    row.id = kommune.kode;

    cell.innerHTML = kommune.kode;
    cell.style.width = "15%";

    cell = row.insertCell(cellCount++);
    cell.innerHTML = kommune.navn;
    cell.style.width = "15%";

    cell = row.insertCell(cellCount++);
    cell.innerHTML = kommune.href;
    cell.style.width = "15%";

    cell = row.insertCell(cellCount++)
    const dropdown = document.createElement('select');
    dropdown.id = "ddRegion" + kommune.kode;

    if (regMap.size === 0) {
        console.error("Region map is empty when creating dropdown");
    }

    regMap.forEach(reg => {
        const element = document.createElement('option');
        element.textContent = reg.navn;
        element.value = reg.kode;
        element.region = reg;
        dropdown.append(element);
    });
    cell.appendChild(dropdown);

    cell = row.insertCell(cellCount++);
    const pbDelete = document.createElement("input");
    pbDelete.type = "button";
    pbDelete.setAttribute("value", "Slet kommune");
    cell.appendChild(pbDelete);

    pbDelete.onclick = function () {
        document.getElementById(kommune.kode).remove();
        deleteKommune(kommune);
    };
    console.log(row);
}


// Fetch kommuner when the "Hent Kommuner" button is clicked
pbCreateKommuneTable.addEventListener("click", fetchKommuner);

// Sort kommuner when the "Sorter Kommuner" button is clicked
pbSortKommuneTable.addEventListener("click", sortAndDisplayKommuner);

// Delete kommune
async function deleteKommune(kommune) {
    const delUrl = "http://localhost:8080/kommune/" + kommune.kode;
    console.log(delUrl);

    try {
        const response = await restDelete(delUrl);
        console.log(response);
        const body = await response.text();
        alert("Kommunen er hermed slettet");
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}




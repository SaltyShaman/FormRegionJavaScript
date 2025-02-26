import { fetchAnyUrl, restDelete } from "./modulejson.js";

console.log("er i kommunetable");

const urlKommune = "http://localhost:8080/kommuner";
const pbCreateKommuneTable = document.getElementById("pbGetKommuner");
const tblKommuner = document.getElementById("tblKommuner");
const pbSortKommuneTable = document.getElementById("pbSortKommuner"); // The Sort button

let kommuner = [];
let displayedKommuneCodes = new Set();

async function fetchKommuner() {
    try {
        kommuner = await fetchAnyUrl(urlKommune);

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

            // Create table rows for each unique kommune
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

    row.id = kommune.kode;

    cell.innerHTML = kommune.kode;
    cell.style.width = "15%";

    cell = row.insertCell(cellCount++);
    cell.innerHTML = kommune.navn;
    cell.style.width = "15%";

    cell = row.insertCell(cellCount++);
    cell.innerHTML = kommune.href;
    cell.style.width = "15%";

    cell = row.insertCell(cellCount++);
    cell.innerHTML = kommune.region.kode;

    cell = row.insertCell(cellCount++);
    cell.innerHTML = kommune.region.navn;

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




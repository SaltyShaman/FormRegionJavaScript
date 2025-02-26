const urlRegioner = "http://localhost:8080/regioner"

let regionMap = new Map()

function fetchAnyUrl(url) {
    return fetch(url).then(response => response.json()).catch(error => console.error("Handled error xx:", error))
}

async function postObjectAsJson(url, object, httpVerbum) {
    const objectAsJsonString = JSON.stringify(object);
    console.log(objectAsJsonString);
    const fetchOptions = {
        method: httpVerbum,
        headers: {
            "Content-Type": "application/json",
        },
        body: objectAsJsonString,
    };
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(errorMessage);
        //throw new Error(errorMessage);
    }
    return response;
}

async function restDelete(url){
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: ""
    }
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        console.log("Delete failed");
    }
    return response;
}

async function fetchRegioner() {
    const regioner = await fetchAnyUrl(urlRegioner)
    console.log("Fetched regions:", regioner);
    regioner.forEach(region => regionMap.set(region.navn, region))
    console.log("Region Map:", regionMap);
    return regionMap
}


export {fetchAnyUrl, postObjectAsJson, restDelete, fetchRegioner};
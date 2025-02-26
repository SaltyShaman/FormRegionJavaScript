console.log("formregionjson.js is loaded");

const urlPostRegion = "http://localhost:8080/region2";

document.addEventListener('DOMContentLoaded', createFormEventListener);
let formRegion;

function createFormEventListener() {
    formRegion = document.getElementById("formRegion");
    formRegion.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    const form = event.currentTarget;
    const url = form.action; // Make sure the form action is set correctly (urlPostRegion)
    console.log(form);
    console.log(url);

    try {
        // Get data from the form
        const formData = new FormData(form);
        console.log(formData);

        // Convert FormData to plain object and send it as JSON
        const responseData = await postFormDataAsJson(url, formData);
        console.log(responseData);
    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

// Convert FormData to a plain object
function formDataToObject(formData) {
    const plainFormData = Object.fromEntries(formData.entries());
    console.log(plainFormData);
    return plainFormData;
}

// Send the form data as JSON to the backend
async function postFormDataAsJson(url, formData) {
    const object = formDataToObject(formData);

    // Send the object as JSON via a POST request
    const response = await postObjectAsJson(url, object);
    return response;
}

// Send an object as JSON via a POST request
async function postObjectAsJson(url, object) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    };

    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    } else {
        const result = await response.json();
        console.log(result);
        return result;
    }
}

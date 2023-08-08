const currentURL = window.location.href;
const urlParts = currentURL.split('/');

// Get the last part
var id = urlParts[urlParts.length - 1];


console.log('Last Parameter:', id);

const editButton = document.getElementById("myEditButton");

editButton.addEventListener("click", function(e) {
    e.preventDefault()
    const formData = new FormData(document.getElementById("handleSubmit"));

    // Convert formData to a plain object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });


    axios.put(`/articles/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log(response.data);
            window.location.href = response.data.location
        })
        .catch(error => {
            // Handle any errors that occur during the Axios request
            console.error("Error:", error);
        });
    // alert("Button clicked!");
});
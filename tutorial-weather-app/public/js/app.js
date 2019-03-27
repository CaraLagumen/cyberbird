//CLIENT-SIDE JS

console.log('client side js file loaded');

//FETCH IS A BROWSER-BASED API
// fetch('http://puzzle.mead.io/puzzle').then(response => {
//     response.json().then(data => {
//         console.log(data);
//     })
// });

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageError = document.getElementById('error');
const messageSuccess = document.getElementById('success');

weatherForm.addEventListener('submit', event => {
    event.preventDefault(); //PREVENTS CONSOLE LOG OF TEST GOING AWAY
    // console.log('test');

    //GET THE VALUE/INPUT
    const location = search.value
    console.log(location);

    messageError.textContent = 'Loading...';
    messageSuccess.textContent = '';

    //FETCHING OUR OWN CREATED JSON IN SRC
    fetch(`/weather?address=${location}`).then(response => { //LOCAL: fetch(`http://localhost:3000/weather?address=${location}`)
        response.json().then(data => {
            if (data.error) {
                messageError.textContent = JSON.stringify(data.error);
                messageSuccess.textContent = '';
            } else {
                messageError.textContent = `Location: ${JSON.stringify(data.location)}`;
                messageSuccess.textContent = `Forecast: ${JSON.stringify(data.forecast)}`;
            }
        })
    })
})
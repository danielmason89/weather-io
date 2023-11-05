let g, options, p;

document.addEventListener('DOMContentLoaded', init);

function init() {
    if (navigator.geolocation) {
        let giveUp = 1000 * 30;
        let tooOld = 1000 * 60 * 60;
        options = {
            enableHighAccuracy: true,
            timeout: giveUp,
            maximum: tooOld
        }
        navigator.geolocation.getCurrentPosition(gotPos, posFail, options);
    } else {
        // using older browser that doesn't support geolocation
    }
}

function getPos(position) {
    spans = document.querySelectorAll('p span');
    spans[0].textContent = position.coords.latitude
    span[1].textContent = position.coords.longitude
    span[6].textContent = position.coords.timestamp
}

function posFail(err) {
    let errors = {
        1: 'No permission',
        2: 'unable to determine',
        3: 'Took too long'
    }
    document.querySelector('h2').textContent = errors[err];
    // err is a number
}
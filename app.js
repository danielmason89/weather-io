const app = {
    init: () => {
        document.getElementById('btn5Day').addEventListener('click', app.fetchWeather);
    },

}

app.init();
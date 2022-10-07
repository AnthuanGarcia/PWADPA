document.addEventListener('DOMContentLoaded', function () {

    // Steps followed from Google developer codelabs:
    // https://codelabs.developers.google.com/codelabs/offline/#5
    var registerServiceWorker = () => {

        if('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }

    }

    registerServiceWorker();

});
const searchBar = document.querySelector('#searchInput');
const page = document.querySelector('#page');
const sortDropdown = document.querySelector('#sortDropdown');
let alleParkhauser = [];

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function zeigeKartenVollstandig(parkhauser){
    parkhauser.forEach(parkhaus => {
        if (parkhaus.title != "Zur Zeit haben wir keine aktuellen Parkhausdaten erhalten") {
            createKarte(parkhaus);
        }
    });
}

// Fetch data from API

async function init() {
    let url = `https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20`;
    parkhauserAlleDetails = await fetchData(url);
    alleParkhauser = parkhauserAlleDetails.results;
    zeigeKartenVollstandig(alleParkhauser);


};


async function fetchData(url) {
    try{
        let antwort = await fetch(url);
        let parkhausDaten = await antwort.json();
        return parkhausDaten;
        
    }
    catch(error){
        console.log(error);
    }
}



// Parkhauskarten erstellen

function createKarte(parkhaus){

    //console.log(parkhaus);

    let karte = document.createElement('div');
    karte.className = 'parkhausKarte';

    let karteName = document.createElement('div');
    karteName.className = 'parkhausName';
    karteName.addEventListener('click', function(){
        details.classList.toggle('detailAnzeige');
    });

    let parkhausName = document.createElement('h2');
    parkhausName.textContent = parkhaus.title;
    karteName.appendChild(parkhausName);

    let icon = document.createElement('div');
    icon.className = 'icon';
    if (parkhaus.auslastung_prozent >= 90){
        icon.style.backgroundColor = 'red';
    } 
    else if(parkhaus.auslastung_prozent >= 70){
        icon.style.backgroundColor = 'orange';
    }
    else if(parkhaus.auslastung_prozent >= 51){
        icon.style.backgroundColor = 'yellow';
    }
    else {
        icon.style.backgroundColor = 'green';
    }
    
    karte.appendChild(icon);
    karte.appendChild(karteName);
    page.appendChild(karte);


    //Details anzeigen
    
    let details = document.createElement('div');
    details.className = 'detailAnzeige';

    let detailAuflistung = document.createElement('ul');
    detailAuflistung.className = 'detailAuflistung';


        let detailItemFree = document.createElement('li');
        detailItemFree.textContent = `Freie Plätze: ${parkhaus.free}`;
        detailAuflistung.appendChild(detailItemFree);
    
        let detailItemTotal = document.createElement('li');
        detailItemTotal.textContent = `Plätze Gesamt: ${parkhaus.total}`;
        detailAuflistung.appendChild(detailItemTotal);
    
        let detailItemLink = document.createElement('li');
        detailItemLink.innerHTML = `<a href="${parkhaus.link}">Zur Webseite</a>`;
        detailAuflistung.appendChild(detailItemLink);

        let apiOutputId = parkhaus.id2;

        let detailItemMaps = document.createElement('li');
        detailItemMaps.innerHTML = mapLinks[apiOutputId];
        detailAuflistung.appendChild(detailItemMaps);   

        let detailItemZeiten = document.createElement('li');
        detailItemZeiten.innerHTML = offnungszeiten[apiOutputId];
        detailAuflistung.appendChild(detailItemZeiten);


        detailAuflistung.appendChild(detailItemFree);
        detailAuflistung.appendChild(detailItemTotal);
        detailAuflistung.appendChild(detailItemZeiten);
        detailAuflistung.appendChild(detailItemLink);
        detailAuflistung.appendChild(detailItemMaps);
        
    

    details.appendChild(detailAuflistung);
    karte.appendChild(details);

}



// Suchfunktion

searchBar.addEventListener('input', function(){
    sucheParkhaus(searchBar.value);
})

async function sucheParkhaus(suchbegriff){
    let gefundenesParkhaus = alleParkhauser.filter(gesuchtesParkhaus => gesuchtesParkhaus.title.includes(suchbegriff));
    page.innerHTML = '';
    zeigeKartenVollstandig(gefundenesParkhaus);
}



// Sortierungsfunktion


sortDropdown.addEventListener('change', function() {
    const selectedOption = sortDropdown.value;
    if (selectedOption === 'alphabet') {
        sortParkhauserAlphabetically();
    } 
    else if (selectedOption === 'auslastung') {
        sortParkhauserByAuslastung();
    } else if (selectedOption === 'entfernung') {
        awaitCurrentLocation().then(currentPosition => {
            sortParkingByDistance(currentPosition);
        });
    }
});

function sortParkhauserAlphabetically() {
    alleParkhauser.sort((a, b) => a.title.localeCompare(b.title));
    page.innerHTML = '';
    zeigeKartenVollstandig(alleParkhauser);
}

function sortParkhauserByAuslastung() {
    alleParkhauser.sort((a, b) => a.auslastung_prozent - b.auslastung_prozent);
    page.innerHTML = '';
    zeigeKartenVollstandig(alleParkhauser);
}












// Funktion, um die Entfernung zwischen zwei Koordinaten zu berechnen (Haversine-Formel)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius der Erde in Kilometern
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Entfernung in Kilometern
    return distance;
}


// Funktion zum Abrufen der Geolokationsdaten des Geräts
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve(position.coords);
            }, error => {
                reject(error.message);
            });
        } else {
            reject('Geolocation wird nicht unterstützt.');
        }
    });
}
async function awaitCurrentLocation() {
    try {
        let currentPosition = await getCurrentLocation();
        return currentPosition;
    } catch (error) {
        console.error('Fehler beim Abrufen von Geolokationsdaten:', error);
    }

}

// Funktion zum Abrufen der Parkhausdaten von der API
async function getParkingData() {
    const response = await fetch('https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20');
    const data = await response.json();
    return data;
}

// Hauptfunktion zum Sortieren der Parkhäuser nach Entfernung zum aktuellen Standort
async function sortParkingByDistance() {
    try {
        const currentPosition = await getCurrentLocation();
        console.log(currentPosition);
        
        // Parkhäuser nach Entfernung sortieren
        alleParkhauser.sort((parking1, parking2) => {
            if (!parking1.geo_point_2d || !parking2.geo_point_2d) return 0;
            let distance1 = calculateDistance(currentPosition.latitude, currentPosition.longitude, parking1.geo_point_2d.lat, parking1.geo_point_2d.lon);
            let distance2 = calculateDistance(currentPosition.latitude, currentPosition.longitude, parking2.geo_point_2d.lat, parking2.geo_point_2d.lon);
            return distance1 - distance2;
        });
  
        page.innerHTML = '';
        zeigeKartenVollstandig(alleParkhauser);
    } catch (error) {
        console.error('Fehler beim Abrufen von Geolokationsdaten oder Sortierung:', error);
    }
}



























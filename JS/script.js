// _____________________________________________________________________________________________________________________________
// BASISFUNKTIONEN
// _____________________________________________________________________________________________________________________________

const searchBar = document.querySelector('#searchInput');
const page = document.querySelector('#page');
const sortDropdown = document.querySelector('#sortDropdown');
let alleParkhauser = [];
let favoritenParkhauser = [];

document.addEventListener('DOMContentLoaded', function() {
    init();
    
});

// Funktion, welche nur Parkhausdaten anzeigt, die vollständig sind
function zeigeKartenVollstandig(parkhauser){
    parkhauser.forEach(parkhaus => {
        if (parkhaus.title != "Zur Zeit haben wir keine aktuellen Parkhausdaten erhalten") {
            createKarte(parkhaus);
        }
    });
    clickFavoritIcon();
    markiereFavoritenIcons();
}
// -----------------------------------------------------------------------------------------------------------------------------





// _____________________________________________________________________________________________________________________________
// API ABGREIFEN UND INITIALISIEREN
// _____________________________________________________________________________________________________________________________

async function init() {
    let url = `https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20`;
    parkhauserAlleDetails = await fetchData(url);
    alleParkhauser = parkhauserAlleDetails.results;
    zeigeKartenVollstandig(alleParkhauser);

    getFavoriten();
    sortParkhauserByFavoriten();
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
// -----------------------------------------------------------------------------------------------------------------------------





// _____________________________________________________________________________________________________________________________
// KARTEN FÜR PARKHÄUSER ERSTELLEN
// _____________________________________________________________________________________________________________________________

function createKarte(parkhaus){

//Elemente der Karte erstellen
    let karte = document.createElement('div');
    karte.className = 'parkhausKarte';

    let topRowDiv = document.createElement('div');
    topRowDiv.className = 'topRowDiv';
    karte.appendChild(topRowDiv);

    let karteName = document.createElement('div');
    karteName.className = 'parkhausName';
    karteName.addEventListener('click', function(){
        details.classList.toggle('detailAnzeige')
    });

    let parkhausName = document.createElement('h2');
    parkhausName.textContent = parkhaus.title;
    karteName.appendChild(parkhausName);

    //Icon erstellen und nach Auslastung einfärben  
    let icon = document.createElement('div');
    icon.className = 'icon';
    if (parkhaus.auslastung_prozent >= 90){
        icon.style.backgroundColor = '#D95D41'; //red
    } 
    else if(parkhaus.auslastung_prozent >= 70){
        icon.style.backgroundColor = '#F2994B'; //orange
    }
    else if(parkhaus.auslastung_prozent >= 51){
        icon.style.backgroundColor = '#F2D64F'; //yellow
    }
    else {
        icon.style.backgroundColor = '#B0D977'; //green
    }

    //Favoriten Icon erstellen
    let favoritIcon = document.createElement('button');
    favoritIcon.className = 'favoritIcon';
    favoritIcon.innerHTML = '&#9733;'; 
    
    //Elemente zur Karte appenden und Karte zur Seite hinzufügen
    topRowDiv.appendChild(icon);
    topRowDiv.appendChild(karteName);
    topRowDiv.appendChild(favoritIcon);
    page.appendChild(karte);    


//Details in die Karten hinzufügen   
    let details = document.createElement('div');
    details.className = 'detailAnzeige';

    let detailAuflistung = document.createElement('ul');
    detailAuflistung.className = 'detailAuflistung';

        //Einzelne Detailinhalte aus API abrufen und in Liste einfügen
        let detailItemFree = document.createElement('li');
        detailItemFree.className = 'freiePlatze';
        detailItemFree.textContent = `Freie Plätze: ${parkhaus.free}`;
    
        let detailItemTotal = document.createElement('li');
        detailItemTotal.textContent = `Plätze Gesamt: ${parkhaus.total}`;
    
        let detailItemLink = document.createElement('li');
        detailItemLink.innerHTML = `<a href="${parkhaus.link}" target="_blank">Zur Website</a>`; //Link zur Website des Parkhauses in neuem Tab öffnen

        let apiOutputId = parkhaus.id2; //ID des Parkhauses aus API abrufen, damit die Links und Öffnungszeiten über die ID abgerufen werden können

        let detailItemMaps = document.createElement('li');
        console.log(mapLinks[apiOutputId]);
        detailItemMaps.innerHTML = `<a href='${mapLinks[apiOutputId]}' target='_blank'>In Google Maps anzeigen</a>`; //Google Maps Link über zusätzliches JAVA abrufen und in neuem Tab öffnen  

        let detailItemZeiten = document.createElement('li');
        detailItemZeiten.className = 'offnungszeiten';
        detailItemZeiten.innerHTML = offnungszeiten[apiOutputId]; //Öffnungszeiten aus zusätzlichem JAVA abrufen

        //Einzelne Detailinhalte in gewünschter Reihenfolge zur Liste hinzufügen
        detailAuflistung.appendChild(detailItemFree);
        detailAuflistung.appendChild(detailItemTotal);
        detailAuflistung.appendChild(detailItemZeiten);
        detailAuflistung.appendChild(detailItemLink);
        detailAuflistung.appendChild(detailItemMaps);
        
    details.appendChild(detailAuflistung);
    karte.appendChild(details);
}
// -----------------------------------------------------------------------------------------------------------------------------





// _____________________________________________________________________________________________________________________________
// SUCHFUNKTION
// _____________________________________________________________________________________________________________________________

searchBar.addEventListener('input', function(){
    sucheParkhaus(searchBar.value.toLowerCase());
})

async function sucheParkhaus(suchbegriff){
    let gefundenesParkhaus = alleParkhauser.filter(gesuchtesParkhaus => gesuchtesParkhaus.title.toLowerCase().includes(suchbegriff));
    page.innerHTML = '';
    zeigeKartenVollstandig(gefundenesParkhaus);
}
// -----------------------------------------------------------------------------------------------------------------------------





// _____________________________________________________________________________________________________________________________
// SORTIERUNGSFUNKTIONEN
// _____________________________________________________________________________________________________________________________

// Eventlistener im Dropdown-Menü um Sortierung zu aktivieren
sortDropdown.addEventListener('change', function() {
    const selectedOption = sortDropdown.value;
    if (selectedOption === 'alphabet') {
        sortParkhauserAlphabetically();
    } 
    else if (selectedOption === 'auslastung') {
        sortParkhauserByAuslastung();
    } 
    else if (selectedOption === 'entfernung') {
        awaitCurrentLocation().then(currentPosition => {
            sortParkingByDistance(currentPosition);
        });
    }
    else if (selectedOption === 'favoriten') {
        sortParkhauserByFavoriten();
    }
});


// Funktionen zur Sortierung der Parkhäuser nach Alphabet, Auslastung und Favoriten --------------------------------------------
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

function sortParkhauserByFavoriten() {
    const favoritenParkhauserSet = new Set(favoritenParkhauser);
    const sortedParkhauser = alleParkhauser.sort((a, b) => {
        if (favoritenParkhauserSet.has(a.title) && !favoritenParkhauserSet.has(b.title)) {
            return -1;
        } 
        else if (!favoritenParkhauserSet.has(a.title) && favoritenParkhauserSet.has(b.title)) {
            return 1;
        } 
        else {
            return 0;
        }
    });
    page.innerHTML = '';
    zeigeKartenVollstandig(sortedParkhauser);
}


//FUNKTION ZUR SORTIERUNG NACH ENTFERNUNG ---------------------------------------------------------------------------------------

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
    } 
    catch (error) {
        console.error('Fehler beim Abrufen von Geolokationsdaten:', error);
    }
}

// Funktion zum Abrufen der Daten von der API um daraus Koordinaten zu erhalten
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
// -----------------------------------------------------------------------------------------------------------------------------





// _____________________________________________________________________________________________________________________________
// Favoritenfunktion
// _____________________________________________________________________________________________________________________________

// Funktionen zum klicken und markieren von Favoriten und Speichern der Favoriten im Local Storage
function clickFavoritIcon() {
    const favoritIcon = document.querySelectorAll('.favoritIcon');
    favoritIcon.forEach(favIcon => {
        favIcon.addEventListener('click', function() {
            this.classList.toggle('markedFavoritIcon');
            console.log('Favorit markiert');
            addFavorit(this);
        });
    });
}

function markiereFavoritenIcons() {
    const favoritIcon = document.querySelectorAll('.favoritIcon');
    favoritIcon.forEach(favIcon => {
        const parkhausname = favIcon.parentNode.childNodes[1].textContent;
        if (favoritenParkhauser.includes(parkhausname)) {
            favIcon.classList.add('markedFavoritIcon');
        } else {
            favIcon.classList.remove('markedFavoritIcon');
        }
    });
}

function addFavorit (favoritbutton){
    let parkhausname = favoritbutton.parentNode.childNodes[1].textContent;
    
    if (favoritenParkhauser.includes(parkhausname)) {
        let index = favoritenParkhauser.indexOf(parkhausname);
        favoritenParkhauser.splice(index, 1);
    } else {
        favoritenParkhauser.push(parkhausname);
    }

    //Schreibt die favorisierenden Parkhäuser in den local storage
    localStorage.setItem('favoritenParkhauser', JSON.stringify(favoritenParkhauser));
}

// Funktion, um die favorisierten Parkhäuser nach reboots wieder aus dem Local Storage zu holen 
function getFavoriten(){
    let favoriten = localStorage.getItem('favoritenParkhauser');
    if (favoriten){
        favoritenParkhauser = JSON.parse(favoriten);

    let parkhausNameNodes = document.querySelectorAll(`.parkhausName`);


    favoritenParkhauser.forEach(favorit => {
        // Wenn das Element auf der Seite mit der Klasse "parkhausName" den Textinhalt "favorit" hat, füge dem Geschwisterelement mit der Klasse "favoritIcon" die Klasse "markedFavoritIcon" hinzu
        parkhausNameNodes.forEach(parkhausName => {
            if (parkhausName.textContent === favorit) {
                let favoritIcon = parkhausName.nextElementSibling;
                favoritIcon.classList.add('markedFavoritIcon');
                return;
            } 
        });
    });
    }
}
// -----------------------------------------------------------------------------------------------------------------------------














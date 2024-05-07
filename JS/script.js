const searchBar = document.querySelector('#searchInput');
const page = document.querySelector('#page');
const sortDropdown = document.querySelector('#sortDropdown');
let alleParkhauser = [];
let favoritenParkhauser = [];

document.addEventListener('DOMContentLoaded', function() {
    init();
    
});


// Fetch data from API

async function init() {
    let url = `https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20`;
    parkhauserAlleDetails = await fetchData(url);
    alleParkhauser = parkhauserAlleDetails.results;
    alleParkhauser.forEach(parkhaus => {
        createKarte(parkhaus);
    });  

    clickFavoritIcon();
    getFavoriten();
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

    let favoritIcon = document.createElement('button');
    favoritIcon.className = 'favoritIcon';
    favoritIcon.innerHTML = '&#9733;';
    // favoritIcon.addEventListener('click', function(){
    //     favoritIcon.classList.toggle('markedFavoritIcon');
    //});    

    
    karte.appendChild(icon);
    karte.appendChild(karteName);
    karte.appendChild(favoritIcon);
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
    gefundenesParkhaus.forEach(parkhaus => {
        createKarte(parkhaus);
    });
}



// Sortierungsfunktion


sortDropdown.addEventListener('change', function() {
    const selectedOption = sortDropdown.value;
    if (selectedOption === 'alphabet') {
        sortParkhauserAlphabetically();
    } 
    else if (selectedOption === 'auslastung') {
        sortParkhauserByAuslastung();
    }
});

function sortParkhauserAlphabetically() {
    alleParkhauser.sort((a, b) => a.title.localeCompare(b.title));
    page.innerHTML = '';
    alleParkhauser.forEach(parkhaus => {
        createKarte(parkhaus);
    });
}

function sortParkhauserByAuslastung() {
    alleParkhauser.sort((a, b) => a.auslastung_prozent - b.auslastung_prozent);
    page.innerHTML = '';
    alleParkhauser.forEach(parkhaus => {
        createKarte(parkhaus);
    });
}







// Favoritenfunktion
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




function addFavorit (favoritbutton){
    let parkhausname = favoritbutton.parentNode.childNodes[1].textContent;
    
    if (favoritenParkhauser.includes(parkhausname)) {
        let index = favoritenParkhauser.indexOf(parkhausname);
        favoritenParkhauser.splice(index, 1);
    } else {
        favoritenParkhauser.push(parkhausname);
    }

    //write favoritenParkhauser in localstorage
    localStorage.setItem('favoritenParkhauser', JSON.stringify(favoritenParkhauser));
}

 
function getFavoriten(){
    let favoriten = localStorage.getItem('favoritenParkhauser');
    if (favoriten){
        favoritenParkhauser = JSON.parse(favoriten);

        let parkhausNameNodes = document.querySelectorAll(`.parkhausName`);


        favoritenParkhauser.forEach(favorit => {
            //if element on page with class "parkhausName" has textContent equal to favorit, add class "markedFavoritIcon" to sibling element with class "favoritIcon"
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










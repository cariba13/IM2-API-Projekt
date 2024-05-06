const searchBar = document.querySelector('#searchInput');
const page = document.querySelector('#page');
let alleParkhauser = [];

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



// Karte erstellen

function createKarte(parkhaus){

    console.log(parkhaus);

    let karte = document.createElement('div');
    karte.classsName = 'parkhausKarte';

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
    gefundenesParkhaus.forEach(parkhaus => {
        createKarte(parkhaus);
    });
}


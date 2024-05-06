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
    //console.log(parkhauserAlleDetails);
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

    let parkhausName = document.createElement('h2');
    parkhausName.textContent = parkhaus.title;
    karteName.appendChild(parkhausName);

    karte.appendChild(karteName);
    page.appendChild(karte);


    //Details anzeigen
    
    let details = document.createElement('div');
    details.className = 'details';

    let detailAuflistung = document.createElement('ul');
    detailAuflistung.className = 'detailAuflistung';


        let detailItemFree = document.createElement('li');
        detailItemFree.textContent = `Freie Plätze: ${parkhaus.free}`;
        detailAuflistung.appendChild(detailItemFree);
    
        let detailItemTotal = document.createElement('li');
        detailItemTotal.textContent = `Total Plätze: ${parkhaus.total}`;
        detailAuflistung.appendChild(detailItemTotal);
    
        let detailItemLink = document.createElement('li');
        detailItemLink.innerHTML = `Website: <a href="${parkhaus.link}">Zur Webseite</a>`;
        detailAuflistung.appendChild(detailItemLink);

        // let detailItemMaps = document.createElement('li');
        // detailItemMaps.textContent = `Google Maps: ${Pfad zu zusätzlichem Info-File}`;
        // detailAuflistung.appendChild(detailItemMaps);

        detailAuflistung.appendChild(detailItemFree);
        detailAuflistung.appendChild(detailItemTotal);
        detailAuflistung.appendChild(detailItemLink);
        // detailAuflistung.appendChild(detailItemMaps);
    

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




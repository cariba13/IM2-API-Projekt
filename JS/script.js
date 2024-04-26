const searchBar = document.querySelector('#searchInput');
const page = document.querySelector('#page');
let alleParkhauser = [];

// Fetch data from API

async function init() {
    let url = `https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?limit=20`;
    parkhauserOhneDetails = await fetchData(url);
    
    alleParkhauser.forEach(parkhaus => {
        createCard(parkhaus);
    });    

}

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

init();



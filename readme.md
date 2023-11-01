HEJ IFALL DET STÄNGDA APIET INTE SKULLE FUNKA SÅ ANVÄNDA DENNA KOD ISÅFALL

const URL = 'https://majazocom.github.io/Data/solaris.json';

const fetchData = async () => {
try {
const response = await fetch(`${URL}`);

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data;

} catch (err) {
console.log('Fetch error', err);
}
}

async function upDateUi(planetId) {
const data = await fetchData();
const selectedPlanet = data.filter(
planet => planet.id === parseInt(planetId)
)[0];

sunShadow(planetId);

const distance = formatDataDistance(selectedPlanet.distance);
const circumference = formatDataCirc(selectedPlanet.circumference);

modal.classList.remove('hidden');
overlay.classList.remove('hidden');

planetName.textContent = selectedPlanet.name;
latinName.textContent = selectedPlanet.latinName;
description.textContent = selectedPlanet.desc;
upDateList(selectedPlanet, distance, circumference);
}

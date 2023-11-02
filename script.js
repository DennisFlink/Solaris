'use strict';
// SELECTORS //
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const planetName = document.querySelector('.name');
const latinName = document.querySelector('.latin-name');
const description = document.querySelector('.description');
const planetElements = document.querySelectorAll('.planet');
const sun = document.querySelector('.sun');
const container = document.querySelector('.container');
const shadow1 = document.querySelector('.sun-shadow1');
const shadow2 = document.querySelector('.sun-shadow2');

const URL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/';

/* HÄMTAR API KEY */
const fetchApiKey = async () => {
  try {
    const response = await fetch(`${URL}/keys`, {
      method: 'POST',
    });

    const data = await response.json();
    return data.key;
  } catch (err) {
    console.log('error', err);
  }
};

/* HÄMTAR DATA BODIES */
const fetchBodies = async () => {
  try {
    let apiKeyResponse = await fetchApiKey();

    const response = await fetch(`${URL}/bodies`, {
      method: 'GET',
      headers: {
        'x-zocom': apiKeyResponse,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Fetch error', err);
  }
};

/*  UPDATE UI  PLANET INFO */
async function upDateUi(planetId) {
  const data = await fetchBodies();
  const planetArray = data.bodies;
  const selectedPlanet = planetArray.filter(
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

/* SUN SHADOWS WHEN PLANET OR THE SUN IS CLICKED */
function sunShadow(planetId) {
  if (planetId == 0) {
    sun.style.backgroundColor = '#ffd029';
    shadow1.style.backgroundColor = '#ffd029';
    shadow2.style.backgroundColor = '#ffd029';
  }
  const selectedColor = planetColors[planetId - 1];
  sun.style.backgroundColor = selectedColor;
  shadow1.style.backgroundColor = selectedColor;
  shadow2.style.backgroundColor = selectedColor;
  shadow1.classList.remove('hidden');
  shadow2.classList.remove('hidden');
}
/* UPDATE LISTS WITH PLANET INFO */
function upDateList(selectedPlanet, distance, circumference) {
  document.querySelectorAll('.list')[0].innerHTML = `
  <li class="item">OMKRETS<span class="span-item">${circumference} km</span></li>
  <li class="item">KM FRÅN SOLEN<span class="span-item">${distance} km</span></li>
  <li class="item">MAX TEMPERATUR<span class="span-item">${selectedPlanet.temp.day}C</span></li>
  <li class="item">MIN TEMPERATUR<span class="span-item">${selectedPlanet.temp.night}C</span></li> 
`;
  document.querySelectorAll(
    '.list'
  )[1].innerHTML = ` <li class="item">MÅNAR<span class="span-item">${selectedPlanet.moons.join(
    ' '
  )}</span></li>`;
}

/* FUNCTION FOR FORMAT DATA circumference */
function formatDataCirc(circumference) {
  const circumferenceStr = circumference.toString();
  const formattedCircum = `${circumferenceStr.slice(
    0,
    2
  )} ${circumferenceStr.slice(2)}`;
  return formattedCircum;
}

/* FUNCTION FOR FORMAT DATA distance */
function formatDataDistance(distance) {
  const distanceStr = distance.toString();
  const formattedDistance = `${distanceStr.slice(0, 3)} ${distanceStr.slice(
    3,
    6
  )} ${distanceStr.slice(6)}`;
  return formattedDistance;
}

/* CLICK DEPENDING ON WHICH PLANET WAS CLICKED SENDING ID TO UPDATE UI */
container.addEventListener('click', event => {
  if (event.target.tagName === 'circle' || event.target.tagName === 'ellipse') {
    const planetId = event.target
      .closest('.planet')
      .getAttribute('id')
      .slice(1);
    upDateUi(planetId);
  }

  if (event.target.classList.contains('sun')) {
    upDateUi('0');
  }
});

/* CLick outside info to close modal */
function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  shadow1.classList.add('hidden');
  shadow2.classList.add('hidden');
  sun.style.backgroundColor = '#ffd029';
}

document.addEventListener('click', event => {
  if (
    event.target.className == 'overlay' ||
    event.target.className == 'modal'
  ) {
    closeModal();
  }
});

/* Hämtar planeternas färg och lägger in i en array */

const planetColors = [];
planetElements.forEach(element => {
  const colors = element.getAttribute('fill');
  planetColors.push(colors);
});

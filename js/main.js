const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonTypes = document.querySelector('.pokemon__types');
const pokemonSpecies = document.querySelector('.pokemon__species');
const pokemonMoves = document.querySelector('.pokemon__moves');
const pokemonGames = document.querySelector('.pokemon__games');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const languageSelect = document.getElementById('language');
const cardContainer = document.querySelector('.card_conteiner');

let searchPokemon = 1;
let selectedLanguage = languageSelect.value;

// Função para buscar dados do Pokémon
const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
  console.error('Pokémon não encontrado ou erro na API');
  return null;
};

// Função para renderizar os dados do Pokémon
const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = 'Loading...';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = `#${data.id}`;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value = '';
    searchPokemon = data.id;

    const types = data.types.map((typeInfo) => typeInfo.type.name).join(', ');
    pokemonTypes.innerHTML = `<strong>Tipo:</strong> ${types}`;

    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    const genusInfo = speciesData.genera.find(genus => genus.language.name === selectedLanguage) || speciesData.genera[0];
    pokemonSpecies.innerHTML = `<strong>Espécie:</strong> ${genusInfo.genus}`;

    const moves = data.moves.slice(0, 5).map((moveInfo) => moveInfo.move.name).join(', ');
    pokemonMoves.innerHTML = `<strong>Movimentos:</strong> ${moves}`;

    const games = data.game_indices.map(gameInfo => gameInfo.version.name).join(', ');
    pokemonGames.innerHTML = `<strong>Jogos:</strong> ${games}`;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
    pokemonTypes.innerHTML = '';
    pokemonSpecies.innerHTML = '';
    pokemonMoves.innerHTML = '';
    pokemonGames.innerHTML = '';
  }
};

// Função para listar todos os Pokémons
const renderPokemonList = async () => {
  for (let i = 1; i <= 151; i++) {
    const data = await fetchPokemon(i);
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <p><strong>${data.name}</strong></p>    
    `;
    card.addEventListener('click', () => {
      renderPokemon(data.id);
    });
    cardContainer.appendChild(card);
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

languageSelect.addEventListener('change', function () {
  selectedLanguage = this.value;
  renderPokemon(searchPokemon);
});

// Renderizar Pokémon inicial e lista
renderPokemon(searchPokemon);
renderPokemonList();

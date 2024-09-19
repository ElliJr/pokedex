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
let selectedLanguage = languageSelect.value; // Idioma inicial

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

// Função para buscar dados da espécie do Pokémon (com suporte a idiomas)
const fetchPokemonSpecies = async (url) => {
  const APIResponse = await fetch(url);
  if (APIResponse.status === 200) {
    const speciesData = await APIResponse.json();
    return speciesData;
  }
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

    // Renderizando Tipos
    const types = data.types.map((typeInfo) => typeInfo.type.name).join(', ');
    pokemonTypes.innerHTML = `<strong>Tipo:</strong> ${types}`;

    // Buscar dados da espécie para mostrar a descrição no idioma correto
    const speciesData = await fetchPokemonSpecies(data.species.url);
    if (speciesData) {
      const genusInfo = speciesData.genera.find(genus => genus.language.name === selectedLanguage) || speciesData.genera[0];
      pokemonSpecies.innerHTML = `<strong>Espécie:</strong> ${genusInfo.genus}`;
    }

    // Renderizando Movimentos (não há suporte direto na API para múltiplos idiomas)
    const moves = data.moves.slice(0, 5).map((moveInfo) => moveInfo.move.name).join(', ');
    pokemonMoves.innerHTML = `<strong>Movimentos:</strong> ${moves}`;

    // Renderizando Jogos
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
      <p><strong>#${data.id}</strong></p>    
    `;
    card.addEventListener('click', () => {
      renderPokemon(data.id);
    });
    cardContainer.appendChild(card);
  }
};

// Evento para buscar Pokémon via formulário
form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

// Evento de botão "Anterior"
buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

// Evento de botão "Próximo"
buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

// Evento de mudança de idioma
languageSelect.addEventListener('change', function () {
  selectedLanguage = this.value; // Atualiza o idioma selecionado
  renderPokemon(searchPokemon); // Re-renderiza o Pokémon atual no novo idioma
});

// Renderizar Pokémon inicial e lista
renderPokemon(searchPokemon);
renderPokemonList();
// Função para alterar o idioma da interface
const updateLanguage = () => {
  const lang = languageSelect.value;

  document.querySelector('.input__search').placeholder = translations[lang].search_placeholder;
  document.querySelector('.language-label').innerText = translations[lang].select_language;
  buttonPrev.innerText = translations[lang].prev;
  buttonNext.innerText = translations[lang].next;
  document.getElementById('descriptionText').innerText = translations[lang].description_text;
};

// Adicionar evento ao seletor de idioma
languageSelect.addEventListener('change', () => {
  selectedLanguage = languageSelect.value;
  updateLanguage();
  renderPokemon(searchPokemon); // Re-renderiza o Pokémon atual no idioma selecionado
});

// Inicializa o idioma quando a página carrega
updateLanguage();
  
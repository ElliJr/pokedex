const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonTypes = document.querySelector('.pokemon__types');
const pokemonSpecies = document.querySelector('.pokemon__species');
const pokemonMoves = document.querySelector('.pokemon__moves');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

// Função para buscar dados do Pokémon
const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
};

// Função para renderizar os dados do Pokémon
const renderPokemon = async (pokemon) => {

  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  pokemonTypes.innerHTML = '';
  pokemonSpecies.innerHTML = '';
  pokemonMoves.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    // Exibir informações principais
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = `#${data.id}`;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value = '';
    searchPokemon = data.id;

    // Exibir tipos
    const types = data.types.map((typeInfo) => typeInfo.type.name).join(', ');
    pokemonTypes.innerHTML = `<strong>Tipo(s):</strong> ${types}`;

    // Exibir espécie (consultando o endpoint da espécie)
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    pokemonSpecies.innerHTML = `<strong>Espécie:</strong> ${speciesData.genera[0].genus}`;

    // Exibir primeiros 5 movimentos
    const moves = data.moves.slice(0, 5).map((moveInfo) => moveInfo.move.name).join(', ');
    pokemonMoves.innerHTML = `<strong>Movimentos:</strong> ${moves}`;

  } else {
    // Exibir erro se o Pokémon não for encontrado
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
    pokemonTypes.innerHTML = '';
    pokemonSpecies.innerHTML = '';
    pokemonMoves.innerHTML = '';
  }
};

// Eventos para navegação entre Pokémon e busca
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

// Renderizar o Pokémon inicial
renderPokemon(searchPokemon);

// Função para mudar o idioma e carregar traduções
document.addEventListener('DOMContentLoaded', function () {

 const languageSelect = document.getElementById('language');
  const inputSearch = document.querySelector('.input__search');
  const prevButton = document.querySelector('.btn-prev');
  const nextButton = document.querySelector('.btn-next');
  const languageLabel = document.querySelector('label[for="language"]');

const translations = {
  pt: {
    title: "Pokédex",
    searchPlaceholder: "Nome ou Número",
    prevButton: "Anterior <",
    nextButton: "Próximo >",
    languageLabel: "Selecione o idioma:"
  },
  en: {
    title: "Pokédex",
    searchPlaceholder: "Name or Number",
    prevButton: "Prev <",
    nextButton: "Next >",
    languageLabel: "Select Language:"
  },
  es: {
    title: "Pokédex",
    searchPlaceholder: "Nombre o Número",
    prevButton: "Anterior <",
    nextButton: "Siguiente >",
    languageLabel: "Seleccione el idioma:"
  }
};

  // Função para mudar o idioma
  function changeLanguage(language) {
    const translation = translations[language];

    document.title = translation.title; // Mudar o título da página
    inputSearch.placeholder = translation.searchPlaceholder;
    prevButton.textContent = translation.prevButton;
    nextButton.textContent = translation.nextButton;
    languageLabel.textContent = translation.languageLabel;
  }

  // Adicionar evento de mudança de idioma
  languageSelect.addEventListener('change', function () {
    changeLanguage(this.value);
  });

  // Definir o idioma padrão
  changeLanguage(languageSelect.value);
});

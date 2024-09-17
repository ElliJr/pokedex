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
const languageSelect = document.getElementById('language');

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
  // Exibir mensagem de carregamento
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

    // Exibir espécie com base no idioma
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    // Mapear o código do idioma
    const languageMap = {
      pt: 'pt-BR',
      en: 'en',
      es: 'es'
    };

    // Tentar encontrar a espécie no idioma certo
    const genusInfo = speciesData.genera.find(genus => genus.language.name === languageMap[selectedLanguage]);
    
    // Se não encontrar, usar um idioma padrão (Inglês)
    const genusText = genusInfo ? genusInfo.genus : speciesData.genera.find(genus => genus.language.name === 'en').genus || 'Espécie não encontrada';
    
    pokemonSpecies.innerHTML = `<strong>Espécie:</strong> ${genusText}`;

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

// Função para mudar o idioma
const changeLanguage = (language) => {
  selectedLanguage = language;  // Atualiza o idioma selecionado
  renderPokemon(searchPokemon);  // Recarrega o Pokémon atual com o novo idioma
};

// Adicionar evento de mudança de idioma
languageSelect.addEventListener('change', function () {
  changeLanguage(this.value);
});

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

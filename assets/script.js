// Variável para guardar o número total de páginas
let totalPages = 1;
let currentPage = 1;

// ==================== SISTEMA DE FAVORITOS ====================
// Função para salvar favoritos no localStorage
function saveFavorites(favorites) {
  localStorage.setItem("rickAndMortyFavorites", JSON.stringify(favorites));
}

// Função para carregar favoritos
function loadFavorites() {
  return JSON.parse(localStorage.getItem("rickAndMortyFavorites")) || [];
}

// Função para verificar se um personagem é favorito
function isFavorite(id) {
  const favorites = loadFavorites();
  return favorites.includes(id);
}

// Função para alternar favorito
function toggleFavorite(id, element) {
  let favorites = loadFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    element.classList.replace('btn-danger', 'btn-warning');
    element.innerHTML = '❤️';
  } else {
    favorites.push(id);
    element.classList.replace('btn-warning', 'btn-danger');
    element.innerHTML = '★';
  }
  saveFavorites(favorites);
}

// Função para mostrar favoritos
function showFavorites() {
  const favorites = loadFavorites();
  if (favorites.length === 0) {
    alert("Você não tem personagens favoritos ainda!");
    return;
  }

  divRes = document.querySelector("#resultado");
  divRes.innerHTML = '<h2 class="text-center my-4">⭐ Seus Favoritos</h2>';

  // Busca cada personagem favoritado
  favorites.forEach(id => {
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then(res => res.json())
      .then(character => {
        const divItem = document.createElement("div");
        divItem.classList.add("card");
        divItem.innerHTML = `
          <img src="${character.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <button class="btn btn-sm btn-danger favorite-btn" data-id="${character.id}">
              ★
            </button>
            <h5 class="card-title">${character.name}</h5>
            <p class="card-text"><b>Status: </b>${character.status}</p>
            <p class="card-text"><b>Espécie: </b>${character.species}</p>
            <p class="card-text"><b>Gênero: </b>${character.gender}</p>
          </div>
        `;
        
        divItem.addEventListener("click", () => {
          showCharacterDetails(character.id);
        });
        
        divRes.appendChild(divItem);
      })
      .catch(error => {
        console.error(`Erro ao cargar personagem ${id}:`, error);
      });
  });
}

// ==================== FUNÇÕES PRINCIPAIS ====================
// Função para exibir os personagens da página especificada
const apiRick = async (page) => {
  try {
    let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
    const api = await fetch(url);
    const data = await api.json();
    
    divRes = document.querySelector("#resultado");
    divRes.innerHTML = "";
    
    data.results.forEach((item) => {
      const divItem = document.createElement("div");
      divItem.classList.add("card");
      divItem.innerHTML = `
        <img src="${item.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <button class="btn btn-sm ${isFavorite(item.id) ? 'btn-danger' : 'btn-outline-warning'} favorite-btn" data-id="${item.id}">
            ${isFavorite(item.id) ? '★' : '❤️'}
          </button>
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text"><b>Status: </b>${item.status}</p>
          <p class="card-text"><b>Espécie: </b>${item.species}</p>
          <p class="card-text"><b>Gênero: </b>${item.gender}</p>
        </div>
      `;
      
      // Evento de clique no card
      divItem.addEventListener("click", (e) => {
        if (!e.target.classList.contains('favorite-btn')) {
          showCharacterDetails(item.id);
        }
      });
      
      // Evento de clique no botão de favorito
      const favBtn = divItem.querySelector('.favorite-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(item.id, favBtn);
      });
      
      divRes.appendChild(divItem);
    });

    // Atualizar paginação
    totalPages = data.info.pages;
    currentPage = page;
    updatePaginationButtons();
    
  } catch (error) {
    console.error("Erro ao obter os personagens:", error);
    window.alert("Ocorreu um erro ao obter os personagens. Tente novamente mais tarde.");
  }
};

// Função para atualizar botões de paginação
function updatePaginationButtons() {
  const prevPageButton = document.querySelector("#prevPageButton");
  const nextPageButton = document.querySelector("#nextPageButton");
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

// ==================== EVENT LISTENERS ====================
// Paginação
document.querySelector("#prevPageButton").addEventListener("click", () => {
  if (currentPage > 1) apiRick(currentPage - 1);
});

document.querySelector("#nextPageButton").addEventListener("click", () => {
  if (currentPage < totalPages) apiRick(currentPage + 1);
});

// Favoritos
document.querySelector("#favoritesLink").addEventListener("click", (e) => {
  e.preventDefault();
  showFavorites();
});

// ==================== OUTRAS FUNÇÕES ====================
// (Mantidas as suas funções originais com pequenos ajustes para os favoritos)
const realTimeSearch = async () => {
  const searchInput = document.querySelector("#searchInput");
  const characterName = searchInput.value.trim();

  if (characterName === "") {
    apiRick(1);
    return;
  }

  try {
    const url = `https://rickandmortyapi.com/api/character/?name=${characterName}`;
    const api = await fetch(url);
    const data = await api.json();

    divRes = document.querySelector("#resultado");
    divRes.innerHTML = "";

    if (data.results?.length > 0) {
      data.results.forEach((item) => {
        const divItem = document.createElement("div");
        divItem.innerHTML = `
          <div class="card">
            <img src="${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <button class="btn btn-sm ${isFavorite(item.id) ? 'btn-danger' : 'btn-outline-warning'} favorite-btn" data-id="${item.id}">
                ${isFavorite(item.id) ? '★' : '❤️'}
              </button>
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"><b>Status: </b>${item.status}</p>
              <p class="card-text"><b>Espécie: </b>${item.species}</p>
              <p class="card-text"><b>Gênero: </b>${item.gender}</p>
            </div>
          </div>
        `;

        divItem.addEventListener("click", (e) => {
          if (!e.target.classList.contains('favorite-btn')) {
            showCharacterDetails(item.id);
          }
        });

        const favBtn = divItem.querySelector('.favorite-btn');
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavorite(item.id, favBtn);
        });

        divRes.appendChild(divItem);
      });
    } else {
      divRes.innerHTML = "<p class='not-found-message'>Nenhum personagem encontrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
  }
};

// (Mantenha as outras funções filterCharacters e showCharacterDetails como estão, apenas adicionando o botão de favoritos)

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  apiRick(1);
});
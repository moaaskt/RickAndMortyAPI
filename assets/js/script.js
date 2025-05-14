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
    favorites = favorites.filter((favId) => favId !== id);
    element.classList.replace("btn-danger", "btn-warning");
    element.innerHTML = "❤️";
  } else {
    favorites.push(id);
    element.classList.replace("btn-warning", "btn-danger");
    element.innerHTML = "★";
  }
  saveFavorites(favorites);
}

// Função para mostrar favoritos
function showFavorites() {
  const favorites = loadFavorites();
  divRes.innerHTML = `
    <section class="favorites-section">
      <h2 class="favorites-title">SEUS FAVORITOS</h2>
      <div class="favorites-grid" id="favoritesGrid"></div>
    </section>
  `;

  const grid = document.getElementById("favoritesGrid");

  if (favorites.length === 0) {
    grid.innerHTML = `
      <div class="empty-favorites">
        <p>Nenhum personagem favoritado ainda!</p>
        <img src="https://i.imgur.com/J5ZQZ9q.png" alt="Portal vazio" width="150">
      </div>
    `;
    return;
  }
  divRes.innerHTML = `
    <h2 class="text-center my-4">⭐ Seus Favoritos</h2>
    <div class="favorites-container"></div>
  `;

  const container = divRes.querySelector(".favorites-container");
  // Busca cada personagem favoritado
  favorites.forEach((id) => {
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((res) => res.json())
      .then((character) => {
        const card = document.createElement("div");
        card.className = "favorite-card";
        card.innerHTML = `
        <img src="${character.image}" class="favorite-card-img" alt="${character.name}">
          <div class="favorite-card-body">
            <h3 class="favorite-card-name">${character.name}</h3>
            <p class="favorite-card-info"><b>Status: </b>${character.status}</p>
            <p class="favorite-card-info"><b>Espécie: </b>${character.species}</p>
            <p class="favorite-card-info"><b>Gênero: </b>${character.gender}</p>
            <button class="btn-remove" data-id="${character.id}">
              Remover dos Favoritos
            </button>
          </div>
        `;
        
      card.querySelector('.btn-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavorite(character.id, card.querySelector('.btn-remove'));
          card.remove();
          if (document.querySelectorAll('.favorite-card').length === 0) {
            grid.innerHTML = `
              <div class="empty-favorites">
                <p>Nenhum personagem favoritado ainda!</p>
                <img src="https://i.imgur.com/J5ZQZ9q.png" alt="Portal vazio" width="150">
              </div>
            `;
          }
        });
        
        grid.appendChild(card);

        container.appendChild(card);
        divItem.addEventListener("click", () => {
          showCharacterDetails(character.id);
        });

        divRes.appendChild(divItem);
      })
      .catch((error) => {
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
          <button class="btn btn-sm ${
            isFavorite(item.id) ? "btn-danger" : "btn-outline-warning"
          } favorite-btn" data-id="${item.id}">
            ${isFavorite(item.id) ? "★" : "❤️"}
          </button>
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text"><b>Status: </b>${item.status}</p>
          <p class="card-text"><b>Espécie: </b>${item.species}</p>
          <p class="card-text"><b>Gênero: </b>${item.gender}</p>
        </div>
      `;

      // Evento de clique no card
      divItem.addEventListener("click", (e) => {
        if (!e.target.classList.contains("favorite-btn")) {
          showCharacterDetails(item.id);
        }
      });

      // Evento de clique no botão de favorito
      const favBtn = divItem.querySelector(".favorite-btn");
      favBtn.addEventListener("click", (e) => {
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
    window.alert(
      "Ocorreu um erro ao obter os personagens. Tente novamente mais tarde."
    );
  }
};

// Função para atualizar botões de paginação
function updatePaginationButtons() {
  const prevPageButton = document.querySelector("#prevPageButton");
  const nextPageButton = document.querySelector("#nextPageButton");
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

// ==================== FUNÇÃO DO MODAL ====================
const showCharacterDetails = async (characterId) => {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${characterId}`
    );
    const characterData = await response.json();

    let modalContent = `
      <div class="row">
        <div class="col-md-4">
          <img src="${
            characterData.image
          }" class="img-fluid rounded mb-3" alt="${characterData.name}">
        </div>
        <div class="col-md-8">
          <p><b>Nome: </b>${characterData.name}</p>
          <p><b>Status: </b>${characterData.status}</p>
          <p><b>Espécie: </b>${characterData.species}</p>
          <p><b>Gênero: </b>${characterData.gender}</p>
          <p><b>Origem: </b>${characterData.origin.name}</p>
          <p><b>Localização: </b>${characterData.location.name}</p>
          ${
            characterData.type
              ? `<p><b>Tipo: </b>${characterData.type}</p>`
              : ""
          }
        </div>
      </div>
    `;

    const characterModalBody = document.querySelector("#characterModalBody");
    characterModalBody.innerHTML = modalContent;

    const characterModalElement = document.getElementById("characterModal");
    characterModalElement.classList.add("animate__bounce");

    const characterModal = new bootstrap.Modal(characterModalElement);
    characterModal.show();

    // Remover a classe animate__bounce ao fechar o modal
    characterModalElement.addEventListener("hidden.bs.modal", () => {
      characterModalElement.classList.remove("animate__bounce");
    });
  } catch (error) {
    console.error("Erro ao obter os detalhes do personagem:", error);
    window.alert(
      "Ocorreu um erro ao obter os detalhes do personagem. Tente novamente mais tarde."
    );
  }
};

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
              <button class="btn btn-sm ${
                isFavorite(item.id) ? "btn-danger" : "btn-outline-warning"
              } favorite-btn" data-id="${item.id}">
                ${isFavorite(item.id) ? "★" : "❤️"}
              </button>
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"><b>Status: </b>${item.status}</p>
              <p class="card-text"><b>Espécie: </b>${item.species}</p>
              <p class="card-text"><b>Gênero: </b>${item.gender}</p>
            </div>
          </div>
        `;

        divItem.addEventListener("click", (e) => {
          if (!e.target.classList.contains("favorite-btn")) {
            showCharacterDetails(item.id);
          }
        });

        const favBtn = divItem.querySelector(".favorite-btn");
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleFavorite(item.id, favBtn);
        });

        divRes.appendChild(divItem);
      });
    } else {
      divRes.innerHTML =
        "<p class='not-found-message'>Nenhum personagem encontrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
  }
};

// Atualiza contador de favoritos
function updateFavoritesCounter() {
  const favorites = JSON.parse(localStorage.getItem('rickAndMortyFavorites')) || [];
  const counter = document.getElementById('favorites-count');
  if (counter) {
    counter.textContent = favorites.length;
  }
}

// Chame esta função sempre que modificar os favoritos
updateFavoritesCounter();

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  apiRick(1);
});

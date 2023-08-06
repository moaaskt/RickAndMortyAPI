

// Variável para guardar o número total de páginas
let totalPages = 1;
let currentPage = 1;

// Função para exibir os personagens da página especificada
const apiRick = async (page) => {
  try {
    let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
    const api = await fetch(url);
    const data = await api.json();
    console.log(data);
    divRes = document.querySelector("#resultado");
    divRes.innerHTML = "";
    data.results.forEach((item) => {
      const divItem = document.createElement("div");
      divItem.classList.add("card");
      divItem.innerHTML = `
        <img src="${item.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text"><b>Status: </b>${item.status}</p>
          <p class="card-text"><b>Espécie: </b>${item.species}</p>
          <p class="card-text"><b>Gênero: </b>${item.gender}</p>
        </div>
      `;
      divItem.addEventListener("click", () => {
        showCharacterDetails(item.id);
      });
      divRes.appendChild(divItem);
    });

    // Atualizar o número total de páginas e a página atual
    totalPages = data.info.pages;
    currentPage = page;

    // Habilitar/desabilitar os botões de página anterior e próxima
    const prevPageButton = document.querySelector("#prevPageButton");
    const nextPageButton = document.querySelector("#nextPageButton");
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  } catch (error) {
    console.error("Erro ao obter os personagens:", error);
    window.alert("Ocorreu um erro ao obter os personagens. Tente novamente mais tarde.");
  }
};

// Event listener para o botão de página anterior
const prevPageButton = document.querySelector("#prevPageButton");
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    apiRick(currentPage - 1);
  }
});

// Event listener para o botão de próxima página
const nextPageButton = document.querySelector("#nextPageButton");
nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    apiRick(currentPage + 1);
  }
});




// funçao para procurar personagem

const realTimeSearch = async () => {
  const searchInput = document.querySelector("#searchInput");
  const characterName = searchInput.value.trim();

  // Verifica se o campo de pesquisa está vazio
  if (characterName === "") {
    apiRick(1); // Volta a exibir todos os personagens caso o campo esteja vazio
    return;
  }

  try {
    const url = `https://rickandmortyapi.com/api/character/?name=${characterName}`;
    const api = await fetch(url);
    const data = await api.json();

    divRes = document.querySelector("#resultado");
    divRes.innerHTML = "";

    if (data.results && data.results.length > 0) {
      // Verifica se há resultados na busca
      data.results.forEach((item) => {
        const divItem = document.createElement("div");
        divItem.innerHTML = `
          <div class="card">
            <img src="${item.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text"><b>Status: </b>${item.status}</p>
              <p class="card-text"><b>Espécie: </b>${item.species}</p>
              <p class="card-text"><b>Gênero: </b>${item.gender}</p>
            </div>
          </div>
        `;

        divItem.addEventListener("click", () => {
          showCharacterDetails(item.id);
        });

        divRes.appendChild(divItem);
      });
    } else {
      // Caso nenhum personagem seja encontrado, exibe a mensagem na página
      divRes.innerHTML = "<p class='not-found-message'>Nenhum personagem encontrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
  }
};




// funçao para filtrar os personagens "vivo,morto ou desconhecido"
const filterCharacters = async (status) => {
  const url = `https://rickandmortyapi.com/api/character/?status=${status}`;
  const api = await fetch(url);
  const data = await api.json();
  console.log(data);
  divRes = document.querySelector("#resultado");
  divRes.innerHTML = "";

  if (data.error) {
    alert("Nenhum personagem encontrado com esse status.");
    return;
  }

  data.results.forEach((item) => {
    const divItem = document.createElement("div");
    divItem.innerHTML = `
        <div class="card" >
          <img src="${item.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text"><b>Status: </b>${item.status}</p>
            <p class="card-text"><b>Espécie: </b>${item.species}</p>
            <p class="card-text"><b>Genero: </b>${item.gender}</p>
          </div>
        </div>
      `;
    divItem.addEventListener("click", () => {
      showCharacterDetails(item.id);
    });
    divRes.appendChild(divItem);
  });


  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach((button) => {
    button.classList.remove("active");
  });


  const selectedButton = document.querySelector(`.btn-filter.${status.toLowerCase()}`);
  selectedButton.classList.add("active");
};




// função modal com informações dos personagens
const showCharacterDetails = async (characterId) => {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${characterId}`
    );
    const characterData = await response.json();

    let modalContent = `
      <p><b>Nome: </b>${characterData.name}</p>
      <p><b>Status: </b>${characterData.status}</p>
      <p><b>Espécie: </b>${characterData.species}</p>
      <p><b>Gênero: </b>${characterData.gender}</p>
      <p><b>Origem: </b>${characterData.origin.name}</p>
      <p><b>Localização: </b>${characterData.location.name}</p>
    `;

    const characterModalBody = document.querySelector("#characterModalBody");
    characterModalBody.innerHTML = modalContent;

    const characterModalElement = document.getElementById("characterModal");
    characterModalElement.classList.add("animate__bounce", "animate__bounce");


    const characterModal = new bootstrap.Modal(characterModalElement);
    characterModal.show();

    // Remover a classe animate__flipInY ao fechar o modal
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


document.addEventListener("DOMContentLoaded", function () {
  // Esta função será chamada quando o conteúdo da página for carregado

  // Chame a função apiRick com a página inicial (1)
  apiRick(1);
});



apiRick(1)


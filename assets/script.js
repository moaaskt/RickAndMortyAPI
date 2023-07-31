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

// Restante do seu código...

// Restante do seu código...


// funçao para procurar personagem

const searchCharacter = async () => {
  const searchInput = document.querySelector("#searchInput");
  const characterName = searchInput.value.trim();

  if (characterName === "") {
    alert("Por favor, digite o nome de um personagem.");
    return;
  }

  const url = `https://rickandmortyapi.com/api/character/?name=${characterName}`;
  const api = await fetch(url);
  const data = await api.json();
  console.log(data);
  divRes = document.querySelector("#resultado");
  divRes.innerHTML = "";

  if (data.error) {
    alert("Personagem não encontrado. Tente novamente.");
    // Limpar o campo de busca
    searchInput.value = "";
    // Voltar à exibição dos personagens iniciais
    apiRick(1);
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

    divRes.appendChild(divItem);
  });
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
  



  // função modal com informaçoes dos personagens
  const showCharacterDetails = async (characterId) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );
      const characterData = await response.json();
  
      // Preencher o conteúdo da modal com as informações do personagem
      let modalContent = `
        <p><b>Nome: </b>${characterData.name}</p>
        <p><b>Status: </b>${characterData.status}</p>
        <p><b>Espécie: </b>${characterData.species}</p>
        <p><b>Gênero: </b>${characterData.gender}</p>
        <p><b>Origem: </b>${characterData.origin.name}</p>
        <p><b>Localização: </b>${characterData.location.name}</p>
      `;
  
      // Preencher o conteúdo da modal com as informações do personagem
      const characterModalBody = document.querySelector("#characterModalBody");
      characterModalBody.innerHTML = modalContent;
  
      // Abrir a modal usando o método show
      const characterModal = new bootstrap.Modal(document.getElementById("characterModal"));
      characterModal.show();
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


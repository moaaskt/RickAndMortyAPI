const apiRick = async (page) => {
    let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
    const api = await fetch(url);
    const data = await api.json();
    console.log(data);
    divRes = document.querySelector("#resultado")
    divRes.innerHTML =""
    data.results.map(item => {
      divItem = document.createElement('div');
      divItem.classList.add('card'); // Adiciona a classe "card" ao elemento
      divItem.innerHTML = `
          <img src="${item.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text"><b>Status: </b>${item.status}</p>
            <p class="card-text"><b>Espécie: </b>${item.species}</p>
            <p class="card-text"><b>Gênero: </b>${item.gender}</p>
          </div>
      `;
  
      divItem.addEventListener('click', () => {
        showCharacterDetails(item.id);
      });
      divRes.appendChild(divItem);
  })
  
}

// ... (código existente) ...

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
      return;

      

      
    }
  
    data.results.forEach((item) => {
      const divItem = document.createElement("div");
      divItem.innerHTML = `
        <div class="card" style="width: 18rem;">
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
        <div class="card" style="width: 18rem;">
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
  
   
    const filterButtons = document.querySelectorAll(".btn-filter");
    filterButtons.forEach((button) => {
      button.classList.remove("active");
    });
  
   
    const selectedButton = document.querySelector(`.btn-filter.${status.toLowerCase()}`);
    selectedButton.classList.add("active");
  };

  const showCharacterDetails = async (characterId) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );
      const characterData = await response.json();
  
      // Verificar se a modal existe antes de preencher o conteúdo
      const characterModal = document.querySelector("#characterModal");
      const characterModalBody = document.querySelector("#characterModalBody");
      if (!characterModal || !characterModalBody) {
        console.error("Modal não encontrada.");
        return;
      }
  
      // Montar o conteúdo da modal com as informações do personagem
      let modalContent = `
        <p><b>Nome: </b>${characterData.name}</p>
        <p><b>Status: </b>${characterData.status}</p>
        <p><b>Espécie: </b>${characterData.species}</p>
        <p><b>Gênero: </b>${characterData.gender}</p>
        <p><b>Origem: </b>${characterData.origin.name}</p>
        <p><b>Localização: </b>${characterData.location.name}</p>
      `;
  
      // Preencher o conteúdo da modal com as informações do personagem
      characterModalBody.innerHTML = modalContent;
  
      // Exibir a modal usando o Bootstrap
      const bootstrapModal = new bootstrap.Modal(characterModal);
      bootstrapModal.show();
    } catch (error) {
      console.error("Erro ao obter os detalhes do personagem:", error);
      window.alert(
        "Ocorreu um erro ao obter os detalhes do personagem. Tente novamente mais tarde."
      );
    }
  };
  
  



apiRick(1)


const apiRick = async (page) => {
    let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
    const api = await fetch(url);
    const data = await api.json();
    console.log(data);
    divRes = document.querySelector("#resultado")
    divRes.innerHTML =""
    data.results.map(item => {
        divItem = document.createElement('div')
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
    
    
    `


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
  



apiRick(1)
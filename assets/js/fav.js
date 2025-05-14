document.addEventListener('DOMContentLoaded', function() {
    loadFavoritesPage();
  });
  
  function loadFavoritesPage() {
    const favorites = JSON.parse(localStorage.getItem('rickAndMortyFavorites')) || [];
    const container = document.getElementById('favorites-container');
  
    if (favorites.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <h3 class="text-white mb-4">Nenhum personagem favoritado ainda!</h3>
          <img src="assets/imgs/empty-portal.gif" alt="Portal vazio" width="200">
          <p class="text-white mt-3">Volte à página inicial e adicione seus favoritos</p>
          <a href="index.html" class="btn btn-portal mt-3">Explorar Personagens</a>
        </div>
      `;
      return;
    }
  
    container.innerHTML = '';
    
    // Carrega todos os favoritos de uma vez
    Promise.all(
      favorites.map(id => 
        fetch(`https://rickandmortyapi.com/api/character/${id}`)
          .then(res => res.json())
      )
    ).then(characters => {
      characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
          <img src="${character.image}" class="card-img-top" alt="${character.name}">
          <div class="card-body p-3">
            <h3 class="card-title text-center">${character.name}</h3>
            <div class="character-info">
              <p><b>Status:</b> ${character.status}</p>
              <p><b>Espécie:</b> ${character.species}</p>
              <p><b>Gênero:</b> ${character.gender}</p>
            </div>
            <button class="btn btn-remove" data-id="${character.id}">
              Remover dos Favoritos
            </button>
          </div>
        `;
        
        card.querySelector('.btn-remove').addEventListener('click', function() {
          removeFavorite(character.id);
          card.remove();
          if (container.children.length === 0) {
            loadFavoritesPage(); // Recarrega se não houver mais favoritos
          }
        });
        
        container.appendChild(card);
      });
    });
  }
  
  function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('rickAndMortyFavorites')) || [];
    favorites = favorites.filter(favId => favId !== id);
    localStorage.setItem('rickAndMortyFavorites', JSON.stringify(favorites));
  }
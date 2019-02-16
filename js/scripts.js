(function() {

  var pokemonRepository = (function() {

    var pokemonRepository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function loadList() {
      showLoadingMessage();
      return $.ajax(apiUrl, { dataType: 'json' }).then(function (response) {
        response.results.forEach( (item) => {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
        hideLoadingMessage();
      });
    }

    function add(pokemon) {
      if (typeof pokemon === "object") {
        pokemonRepository.push(pokemon);
      } else {
        return {
          message: "not an object"
        }
      }
    }

    function getAll() {
      return pokemonRepository;
    }

    function loadDetails(item) {
      showLoadingMessage();
      var url = item.detailsUrl;
      return $.ajax(url, { dataType: 'json' }).then(function (response) {
        console.log(response); // This is the parsed JSON response
        item.imageUrl = response.sprites.front_default;
        item.height = response.height;
        item.types = Object.keys(response.types);
        hideLoadingMessage();
      });
    }

    function showLoadingMessage() {
      var loadingIcon = document.createElement('div');
      loadingIcon.innerHTML = 'Now loading!';
      loadingIcon.classList.add('loading-icon');
      $('body').append(loadingIcon);
    }

    function hideLoadingMessage() {
      var el = $('.loading-icon');
      setTimeout( () => {
        el.remove();
      }, 1000);
    }

    return {
      add: add,
      getAll: getAll,
      loadList: loadList,
      loadDetails: loadDetails
    }
  })();

  function addListItem(pokemon) {
    var pokeLi = $(`<li class="pokeListItem">${pokemon.name}</li>`);
    pokeLi.on('click', (e) => {
      showDetails(pokemon);
    });
    $('#pokemonList').append(pokeLi);

  }

  pokemonRepository.loadList().then( () => {
    // get all pokemon objects from repository and add them to the DOM
    pokemonRepository.getAll().forEach( (pokemon) => {
      addListItem(pokemon);
    });
  });


  // the function run upon clicking a pokemon li
  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then( () => {
      MODAL_CONTROLS.showModal(pokemon);
    });
  }

})();

var MODAL_CONTROLS = (function() {
  var $modalContainer = $('#modal-container');

  function showModal(pokemon) {
    $modalContainer.empty();
    var modal = $(`<div class="modal"></div>`);
    var closeButton = $(`<button class="modal-close">Close</button>`).on('click', hideModal);
    var name = $(`<h1>${pokemon.name}</h1>`);
    var image = $(`<img src='${pokemon.imageUrl}' />`)
    modal
    .append(closeButton)
    .append(name)
    .append(image);
    $modalContainer.append(modal).addClass('is-visible');
  }

  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  $modalContainer.on('click', (e) => {
    var target = e.target;
    if (e.target.classList.contains('is-visible')) {
      hideModal();
    }
  });

  return {
    showModal: showModal,
    hideModal: hideModal
  }

})();

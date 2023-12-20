        let nextUrl = 'https://pokeapi.co/api/v2/pokemon';

        // JavaScript function to handle form submission and redirect
        function searchPokemon() {
            const query = document.getElementById('pokemonQuery').value;
            window.location.href = `pkmn.html?q=${query}`;
            return false; // Prevent the form from submitting the traditional way
        }

        // Fetch and display the list of Pokemon
        async function fetchPokemonList(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                displayPokemonList(data.results);
                nextUrl = data.next; // Update the next URL for the "Load More" button
            } catch (error) {
                console.error('Error fetching Pokemon list:', error);
                alert('Error fetching Pokemon list. Please try again.');
            }
        }

        // Display the list of Pokemon on the page
        function displayPokemonList(pokemonList) {
            const listContainer = document.getElementById('pokemonList');

            // Append new items to the container
            const listItems = pokemonList.map(pokemon => `<div class="list-item read"><a href="pkmn.html?q=${pokemon.name}" class="list-link"><p>${pokemon.name}</p></a></div>`).join('');
            listContainer.innerHTML += listItems;

            // Show the "Load More" button
            document.getElementById('loadMoreBtn').classList.remove('hidden');
        }

        // Load more Pokemon when the button is clicked
        function loadMorePokemon() {
            // Hide the "Load More" button during loading
            document.getElementById('loadMoreBtn').classList.add('hidden');

            if (nextUrl) {
                fetchPokemonList(nextUrl);
            } else {
                alert('No more Pokemon to load.');
            }
        }

        // Fetch and display the initial set of Pokemon when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            fetchPokemonList(nextUrl);
        });
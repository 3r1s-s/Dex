async function fetchPokemonInfo() {
    const params = new URLSearchParams(window.location.search);
    const pokemonIdOrName = params.get('q');

    if (!pokemonIdOrName) {
        alert("Please provide a Pokemon ID or Name using the 'q' parameter.");
        return;
    }

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName.toLowerCase()}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // basic info 
        document.getElementById('pokemonName').innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        document.getElementById('pokemonId').innerText = `#${data.id}`;
        document.getElementById('pokemonType').innerText = `${data.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ')}`;
        document.getElementById('pokemonImage').src = data.sprites.front_default;

        // set flavor text
        const flavorText = data.species.url;
        await fetchFlavorText(flavorText);

        // set gradient
        setGradient(data.types[0].type.name);
        displayStats(data.stats);
        displayMoves(data.moves);
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        alert('Error fetching Pokemon data. Please try again.');
    }
}


async function displayMoves(moves) {
    const movesContainer = document.querySelector('.moves');

    // get the moves
    const levelUpMoves = moves.filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'));

    // Sort level-up moves by level
    levelUpMoves.sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at);

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('move-grid');

    // header
    const headerRow = document.createElement('div');
    headerRow.classList.add('move-row', 'header-row');
    headerRow.innerHTML = '<div>Lv</div><div>Move</div><div>Pow</div><div>Acc</div><div>PP</div>';
    gridContainer.appendChild(headerRow);

    // move rows
    for (const move of levelUpMoves) {
        const moveDetails = await fetchMoveDetails(move.move.url);
        const row = document.createElement('div');
        row.classList.add('move-row');
        row.innerHTML = `<div>${move.version_group_details[0].level_learned_at}</div>
                <div class="grid-item">${move.move.name}</div>
                <div class="grid-item">${moveDetails.power || '-'}</div>
                <div class="grid-item">${moveDetails.accuracy || '-'}</div>
                <div class="grid-item">${moveDetails.pp || '-'}</div>`;
        gridContainer.appendChild(row);
    }
    movesContainer.innerHTML = '';
    movesContainer.appendChild(gridContainer);
}


//move details pp, acc, dmg, ect.
async function fetchMoveDetails(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            power: data.power,
            accuracy: data.accuracy,
            pp: data.pp,
        };
    } catch (error) {
        console.error('Error fetching move details:', error);
        return {};
    }
}




// do the stats
function displayStats(stats) {
    const statsContainer = document.querySelector('.stats');
    statsContainer.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement('p');
        statElement.innerText = `${stat.stat.name}: ${stat.base_stat}`;
        statsContainer.appendChild(statElement);
    });
}

async function fetchFlavorText(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const flavorText = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
        const cleanedFlavorText = flavorText.replace(/[\n\f\r]/g, ' ');

        document.getElementById('flavorText').innerText = cleanedFlavorText;
    } catch (error) {
        console.error('Error fetching flavor text:', error);
        alert('Error fetching flavor text. Please try again.');
    }
}


function setGradient(type) {
    const body = document.body;

    // colours for every type
    const typeColors = {
        fire: 'rgba(240, 128, 48, 0.5)',
        water: 'rgba(104, 144, 240, 0.5)',
        grass: 'rgba(120, 200, 80, 0.5)',
        electric: 'rgba(248, 208, 48, 0.5)',
        psychic: 'rgba(248, 88, 136, 0.5)',
        ice: 'rgba(152, 216, 216, 0.5)',
        dragon: 'rgba(112, 56, 248, 0.5)',
        dark: 'rgba(112, 88, 72, 0.5)',
        fairy: 'rgba(238, 153, 172, 0.5)',
        normal: 'rgba(168, 168, 120, 0.5)',
        fighting: 'rgba(192, 48, 40, 0.5)',
        flying: 'rgba(168, 144, 240, 0.5)',
        poison: 'rgba(160, 64, 160, 0.5)',
        ground: 'rgba(224, 192, 104, 0.5)',
        rock: 'rgba(184, 160, 56, 0.5)',
        bug: 'rgba(168, 184, 32, 0.5)',
        ghost: 'rgba(112, 88, 152, 0.5)',
        steel: 'rgba(184, 184, 208, 0.5)',
        stellar: 'rgba(124, 199, 178, 0.5)',
    };

    //  background gradient based on type
    const gradientColor = typeColors[type] || 'rgba(0, 0, 0, 0.8)';

    // Set epic gradient
    document.documentElement.style.setProperty('--background-gradient', `radial-gradient(circle at top center, ${gradientColor} 0%, rgba(0, 0, 0, 0) 100%)`);
}
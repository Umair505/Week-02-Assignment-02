const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const playerList = document.getElementById("player-list");
const cartItemsContainer = document.getElementById("cart-items");

let count = 0;
const cart = new Set();

searchBtn.addEventListener('click', () => {
    searchPlayer(searchInput.value);
});

const defaultDisplay = () => {
    fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=a")
        .then(res => res.json())
        .then(data => {
            if (data && data.player) {
                displayPlayers(data.player);
            }
        });
};

defaultDisplay();

const searchPlayer = (value) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${value}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.player) {
                displayPlayers(data.player);
            } else {
                playerList.innerHTML = `<h2 class="text-center text-danger">Sorry Player Not Found!</h2>`;
            }
        });
};

const displayPlayers = (players) => {
    playerList.innerHTML = "";

    players.forEach(player => {
        const div = document.createElement("div");
        div.classList.add("player-card");
        div.innerHTML = `
            <img src="${player.strCutout}" alt="${player.strPlayer}">
            <h5 class="mt-3">${player.strPlayer}</h5>
            <p><strong>Nationality:</strong> ${player.strNationality}</p>
            <p><strong>Team:</strong> ${player.strTeam}</p>
            <p><strong>Height:</strong> ${player.strHeight}</p>
            <p><strong>Weight:</strong> ${player.strWeight}</p>
            <p><strong>Position:</strong> ${player.strPosition}</p>
            <button onclick="showDetails(${player.idPlayer})" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#playerModal">Details</button>
            <button onclick="addToCart('${player.strPlayer}')" class="btn btn-success" id="add-btn-${player.strPlayer}">Add to Cart</button>

        `;
        playerList.appendChild(div);
    });
};

const showDetails = (playerId) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.players) {
                const player = data.players[0];
                const modalBody = document.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <img src="${player.strThumb}" alt="${player.strPlayer}">
                    <h5>${player.strPlayer}</h5>
                    <p><strong>Nationality:</strong> ${player.strNationality}</p>
                    <p><strong>Team:</strong> ${player.strTeam}</p>
                    <p><strong>Height:</strong> ${player.strHeight}</p>
                    <p><strong>Weight:</strong> ${player.strWeight}</p>
                    <p><strong>Position:</strong> ${player.strPosition}</p>
                    <p><strong>Date of Birth:</strong> ${player.dateBorn}</p>
                `;
            }
        });
};

const addToCart = (name) => {
    const addButton = document.getElementById(`add-btn-${name}`);
    if (cart.has(name)) {
        addButton.textContent = "Already Added";
        addButton.disabled = true;
    } 
    else {
        if (count === 11) {
            alert("Sorry You Cannot add more than 11 players");
        } else {
            count++;
            cart.add(name);
            document.querySelector("span").innerText = count;

            const div = document.createElement("div");
            div.innerHTML = `<h4 class="text-danger">${name}</h4>`;
            cartItemsContainer.appendChild(div);

            addButton.textContent = "Already Added";
            addButton.disabled = true;
        }
    }
};

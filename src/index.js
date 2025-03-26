const card = document.getElementById("character-bar");
const charName = document.getElementById("name");
const charImage = document.getElementById("image");
const voteCount = document.getElementById("vote-count");  
const voteForm = document.querySelector("#votes-form");
const inputVote = document.querySelector("#votes");
let selectedChar = null;

function displayName() {
    fetch("http://localhost:3000/characters")
        .then(res => res.json())
        .then((characters) => {
            characters.forEach(character => {
                const container = document.createElement("span");
                container.textContent = character.name;
                container.style.cursor = "pointer"; 
                container.addEventListener("click", () => displayCharacter(character)); 
                card.appendChild(container);
            });
        })
        .catch(error => console.error("Error fetching characters:", error));
}

function displayCharacter(character) {
    charName.textContent = character.name;
    charImage.src = character.image;
    charImage.alt = character.name;
    voteCount.textContent = character.votes;
    selectedChar = character;  
}

voteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!selectedChar) {
        alert("Select an animal first");
        return;
    }

    const newVotes = parseInt(inputVote.value, 10);

    if (isNaN(newVotes) || newVotes < 0) {
        alert("Invalid number");
        return;
    }

    selectedChar.votes += newVotes;
    voteCount.textContent = selectedChar.votes;

    updateVotes(selectedChar);

    inputVote.value = "";
});

function updateVotes(character) {
    fetch(`http://localhost:3000/characters/${character.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ votes: character.votes })
    })
    .then(res => res.json())
    .then(data => console.log("Votes updated:", data))
    .catch(error => console.error("Error updating votes:", error));
}

document.addEventListener("DOMContentLoaded", displayName);

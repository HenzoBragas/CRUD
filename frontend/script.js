// Variáveis
const numberInput = document.querySelector('.card-number-input');
const nameInput = document.querySelector('.card-holder-input');
const monthInput = document.querySelector('.month-input');
const yearInput = document.querySelector('.year-input');
const cvvInput = document.querySelector('.cvv-input');
const form = document.getElementById('addCardForm');

// Função para verificar dados
function verificaDados() {
    if (numberInput.value.trim() === '' ||
        nameInput.value.trim() === '' ||
        monthInput.value.trim() === '' ||
        yearInput.value.trim() === '' ||
        cvvInput.value.trim() === ''
    ) {
        alert("ERROR, preencha todos os campos.");
        return false;
    }
    return true;
}

// Atualizar cartão dinâmico
numberInput.oninput = () => {
    document.querySelector('.card-number-box').innerText = numberInput.value || '################';
}

nameInput.oninput = () => {
    document.querySelector('.card-holder-name').innerText = nameInput.value || 'full name';
}

monthInput.oninput = () => {
    document.querySelector('.exp-month').innerText = monthInput.value || 'mm';
}

yearInput.oninput = () => {
    document.querySelector('.exp-year').innerText = yearInput.value || 'yy';
}

cvvInput.onmouseenter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

cvvInput.onmouseleave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

cvvInput.oninput = () => {
    document.querySelector('.cvv-box').innerText = cvvInput.value || '';
}

// Função para carregar cartões
function loadCards() {
    fetch('http://localhost:3000/cards')
        .then(response => response.json())
        .then(cards => {
            const cardList = document.getElementById('card-list');
            cardList.innerHTML = '';

            cards.forEach(card => {
                cardList.innerHTML += `
                    <tr>
                        <td>${card.cardNumber}</td>
                        <td>${card.cardHolder}</td>
                        <td>${card.expirationMonth}</td>
                        <td>${card.expirationYear}</td>
                        <td>${card.cvv}</td>
                        <td><i class="fas fa-edit" onclick="editCard(${card.id})" style="cursor: pointer;"></i></td>
                        <td><i class="fas fa-trash" onclick="deleteCard(${card.id})" style="cursor: pointer;"></i></td>
                    </tr>
                `;
            });
        })
        .catch(error => console.log('Erro:', error));
}

// Função para adicionar novo cartão
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Ativo');

    if (!verificaDados()) return;

    const cardData = {
        cardNumber: numberInput.value,
        cardHolder: nameInput.value,
        expirationMonth: monthInput.value,
        expirationYear: yearInput.value,
        cvv: cvvInput.value
    };

    fetch('http://localhost:3000/cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cartão adicionado:', data);
        loadCards();
        form.reset(); // Limpar o formulário após o envio
    })
    .catch(error => console.log('Erro:', error));
});

// Função para editar cartão
function editCard(id) {
    console.log('Ativo');
    fetch(`http://localhost:3000/cards/${id}`)
        .then(response => response.json())
        .then(card => {
            numberInput.value = card.cardNumber;
            nameInput.value = card.cardHolder;
            monthInput.value = card.expirationMonth;
            yearInput.value = card.expirationYear;
            cvvInput.value = card.cvv;
            document.querySelector('.submit-btn').value = 'Update';
            document.querySelector('.submit-btn').onclick = () => updateCard(id);
        })
        .catch(error => console.log('Erro:', error));
}

// Função para atualizar cartão
function updateCard(id) {
    console.log('Ativo');
    const updatedCardData = {
        cardNumber: numberInput.value,
        cardHolder: nameInput.value,
        expirationMonth: monthInput.value,
        expirationYear: yearInput.value,
        cvv: cvvInput.value
    };

    fetch(`http://localhost:3000/cards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCardData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cartão atualizado:', data);
        loadCards();
        form.reset();
        document.querySelector('.submit-btn').value = 'submit';
    })
    .catch(error => console.log('Erro:', error));
}

// Função para deletar cartão
function deleteCard(id) {
    console.log('Ativo');
    fetch(`http://localhost:3000/cards/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cartão deletado:', data);
        loadCards();
    })
    .catch(error => console.log('Erro:', error));
}

// Carregar os cartões ao iniciar a página
load

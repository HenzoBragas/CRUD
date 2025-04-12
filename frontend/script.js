// Variáveis do formulário
const numberInput = document.querySelector('.card-number-input');
const nameInput = document.querySelector('.card-holder-input');
const monthInput = document.querySelector('.month-input');
const yearInput = document.querySelector('.year-input');
const cvvInput = document.querySelector('.cvv-input');
const form = document.getElementById('addCardForm');
const cardList = document.getElementById('card-list');

let editingCardId = null;

// Função para verificar se todos os campos estão preenchidos
function verificaDados() {
    return numberInput.value.trim() !== '' &&
           nameInput.value.trim() !== '' &&
           monthInput.value.trim() !== '' &&
           yearInput.value.trim() !== '' &&
           cvvInput.value.trim() !== '';
}

// Atualizar exibição do cartão
function updateCardDisplay() {
    document.querySelector('.card-number-box').innerText = numberInput.value || '################';
    document.querySelector('.card-holder-name').innerText = nameInput.value || 'full name';
    document.querySelector('.exp-month').innerText = monthInput.value || 'mm';
    document.querySelector('.exp-year').innerText = yearInput.value || 'yy';
}

// Eventos de entrada para atualizar visualização
numberInput.addEventListener('input', updateCardDisplay);
nameInput.addEventListener('input', updateCardDisplay);
monthInput.addEventListener('input', updateCardDisplay);
yearInput.addEventListener('input', updateCardDisplay);

cvvInput.addEventListener('mouseenter', () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
});

cvvInput.addEventListener('mouseleave', () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
});

cvvInput.addEventListener('input', () => {
    document.querySelector('.cvv-box').innerText = cvvInput.value || '';
});

// Função para carregar cartões
function loadCards() {
    fetch(`https://crud-ohzo.onrender.com/cards`)
        .then(response => response.json())
        .then(cards => {
            cardList.innerHTML = '';
            cards.forEach(card => {
                cardList.innerHTML += `
                    <tr data-id="${card.idNumber}">
                        <td>${card.cardNumber}</td>
                        <td>${card.cardHolder}</td>
                        <td>${card.expirationMonth}</td>
                        <td>${card.expirationYear}</td>
                        <td>${card.cvv}</td>
                        <td>
                            <i class="fas fa-edit edit-btn" style="cursor: pointer;" onclick="editCard(${card.idNumber})"></i>
                            <i class="fas fa-trash delete-btn" style="cursor: pointer;" onclick="deleteCard(${card.idNumber})"></i>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.log('Erro:', error));
}

// Função para editar cartão
function editCard(id) {
    fetch(`https://crud-ohzo.onrender.com/cards/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar o cartão');
            }
            return response.json();
        })
        .then(card => {
            // Preenche os campos de entrada com os dados do cartão
            numberInput.value = card.cardNumber;
            nameInput.value = card.cardHolder;
            monthInput.value = card.expirationMonth;
            yearInput.value = card.expirationYear;
            cvvInput.value = card.cvv;

            // Armazena o ID do cartão para atualizações
            editingCardId = card.idNumber; 
            updateCardDisplay(); // Atualiza a exibição do cartão
            form.addEventListener('submit', (e) =>{
                form.reset();
            })
            
        })
        .catch(error => console.error('Erro ao editar o cartão:', error));
}



// Função para deletar cartão
function deleteCard(id) {
    fetch(`https://crud-ohzo.onrender.com/cards${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cartão deletado:', data);
        form.reset();
        loadCards();
    })
    .catch(error => console.log('Erro:', error));
}

// Adicionar novo cartão ou atualizar
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!verificaDados()) {
        alert("ERROR, preencha todos os campos.");
        return;
    }

    const cardData = {
        cardNumber: numberInput.value,
        cardHolder: nameInput.value,
        expirationMonth: monthInput.value,
        expirationYear: yearInput.value,
        cvv: cvvInput.value
    };

    const method = editingCardId ? 'PUT' : 'POST';
    const url = editingCardId ? `$https://crud-ohzo.onrender.com/cards/${editingCardId}` : `https://crud-ohzo.onrender.com/cards`;

    // Verificação de duplicados antes de inserir um novo cartão
    if (!editingCardId) {
        fetch('https://crud-ohzo.onrender.com/cards') // Verifica todos os cartões existentes
            .then(response => response.json())
            .then(cards => {
                const isDuplicate = cards.some(card => card.cardNumber === cardData.cardNumber && card.cardHolder === cardData.cardHolder);
                if (isDuplicate) {
                    alert('Um cartão com este número e titular já existe.');
                    return;
                }

                // Se não houver duplicado, insira o novo cartão
                return fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cardData)
                });
            })
            .then(response => response && response.json())
            .then(data => {
                if (data) {
                    console.log(editingCardId ? 'Cartão atualizado:' : 'Cartão adicionado:', data);
                    loadCards();
                    form.reset();
                    updateCardDisplay();
                    editingCardId = null; // Resetar ID de edição
                    document.querySelector('.submit-btn').value = 'submit'; // Resetar botão
                }
            })
            .catch(error => console.log('Erro:', error));
    } else {
        // Se estamos editando um cartão, apenas faça o PUT
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Cartão atualizado:', data); // Loga os dados do cartão atualizado
            loadCards(); // Recarrega a lista de cartões
            updateCardDisplay(); // Reseta a exibição do cartão
            editingCardId = null; // Resetar ID de edição
        })
        .catch(error => console.log('Erro:', error));
    }
});

// Carregar cartões ao iniciar
loadCards();

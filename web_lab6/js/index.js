// Константы для иконок
const ICONS = {
    level: "./img/level.webp",
    basePower: {
        hp: "./img/hp.webp",
        fp: "./img/fp.webp",
        stamina: "./img/stamina.webp"
    },
    stats: {
        vigor: "./img/vigor.webp",
        attunement: "./img/attunement.webp",
        endurance: "./img/endurance.webp",
        vitality: "./img/vitality.webp",
        strength: "./img/strength.webp",
        dexterity: "./img/dexterity.webp",
        intelligence: "./img/intelligence.webp",
        faith: "./img/faith.webp",
        luck: "./img/luck.webp"
    }
};

const CHARACTER_DATA = {
    name: "Cetaera",
    classImage: "./img/sorcerer.webp",
    level: 68,
    basePower: {
        hp: 828,
        fp: 136,
        stamina: 111
    },
    stats: {
        "Жизненная сила": 21,
        "Учёность": 18,
        "Стойкость": 15,
        "Физическая мощь": 11,
        "Сила": 22,
        "Ловкость": 20,
        "Интеллект": 30,
        "Вера": 8,
        "Удача": 12
    }
};

// Базовый класс блока
class Block {
    constructor(title) {
        this.title = title;
    }
    render() {
        return `<div class="block"><h3>${this.title}</h3></div>`;
    }
}

class TextBlock extends Block {
    constructor(title, text) {
        super(title);
        this.text = text;
    }
    render() {
        return `
            <div class="block text-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    <li class="stat-item"><span class="stat-name">${this.text}</span></li>
                </ul>
            </div>`;
    }
}

class ImageBlock extends Block {
    constructor(title, imageUrl) {
        super(title);
        this.imageUrl = imageUrl;
    }
    render() {
        return `
            <div class="block image-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    <li class="stat-item"><img src="${this.imageUrl}" alt="${this.title}" class="avatar-image"></li>
                </ul>
            </div>`;
    }
}

class StatBlock extends Block {
    constructor(title, stats, icons) {
        super(title);
        this.stats = stats;
        this.icons = icons;
    }
    render() {
        const statTranslations = {
            "Жизненная сила": "vigor",
            "Учёность": "attunement",
            "Стойкость": "endurance",
            "Физическая мощь": "vitality",
            "Сила": "strength",
            "Ловкость": "dexterity",
            "Интеллект": "intelligence",
            "Вера": "faith",
            "Удача": "luck"
        };

        let statsHtml = Object.entries(this.stats)
            .map(([key, value]) => {
                const iconKey = statTranslations[key]; // Перевод ключа
                const iconSrc = this.icons[iconKey] || ''; // Получаем иконку по переводу
                return `
                    <li class="stat-item">
                        <img src="${iconSrc}" alt="${key}" class="stat-icon">
                        <span class="stat-name">${key}</span>
                        <span class="stat-value">${value}</span>
                    </li>`;
            })
            .join("");

        return `
            <div class="block stat-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">${statsHtml}</ul>
            </div>`;
    }
}

class LevelBlock extends Block {
    constructor(level) {
        super("Уровень");
        this.level = level;
    }
    render() {
        return `
            <div class="block level-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    <li class="stat-item">
                        <img src="${ICONS.level}" alt="Уровень" class="stat-icon">
                        <span class="stat-name">Текущий уровень</span>
                        <span class="stat-value">${this.level}</span>
                    </li>
                </ul>
            </div>`;
    }
}

class BasePowerBlock extends Block {
    constructor(hp, fp, stamina) {
        super("Базовая сила");
        this.hp = hp;
        this.fp = fp;
        this.stamina = stamina;
    }
    render() {
        return `
            <div class="block base-power-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    <li class="stat-item">
                        <img src="${ICONS.basePower.hp}" alt="ОЗ (HP)" class="stat-icon">
                        <span class="stat-name">ОЗ (HP)</span>
                        <span class="stat-value">${this.hp}</span>
                    </li>
                    <li class="stat-item">
                        <img src="${ICONS.basePower.fp}" alt="ОК (FP)" class="stat-icon">
                        <span class="stat-name">ОК (FP)</span>
                        <span class="stat-value">${this.fp}</span>
                    </li>
                    <li class="stat-item">
                        <img src="${ICONS.basePower.stamina}" alt="Выносливость" class="stat-icon">
                        <span class="stat-name">Выносливость</span>
                        <span class="stat-value">${this.stamina}</span>
                    </li>
                </ul>
            </div>`;
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const editButton = document.createElement('button');
    editButton.textContent = '🖊️'; // Эмодзи карандаша
    editButton.id = 'editButton';
    Object.assign(editButton.style, {
        position: 'absolute',
        top: '25px',
        right: '25px'
    });
    header.appendChild(editButton);

    function validateNumberInput(input, min = 1, max = 1000) {
        input.addEventListener('input', function() {
            let value = parseInt(input.value, 10);
            if (isNaN(value) || value < min) {
                alert(`Значение не может быть меньше ${min}.`);
                input.value = min;
            } else if (value > max) {
                alert(`Значение не может быть больше ${max}.`);
                input.value = max;
            }
        });
    }

    function enableImageEditing(elements) {
        elements.forEach(element => {
            element.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';

                input.addEventListener('change', function() {
                    const file = input.files[0];
                    if (file && file.type.startsWith('image/')) {
                        if (file.size > 5 * 1024 * 1024) {
                            alert("Размер изображения превышает 5 МБ.");
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = e => element.src = e.target.result;
                        reader.readAsDataURL(file);
                    } else {
                        alert("Выбранный файл не является изображением.");
                    }
                });

                input.click();
            });
        });
    }

    editButton.addEventListener('click', function() {
        document.body.classList.toggle('edit-mode');

        const isEditMode = document.body.classList.contains('edit-mode');
        const statValues = document.querySelectorAll('.stat-value');
        const avatarImages = document.querySelectorAll('.avatar-image');
        const statIcons = document.querySelectorAll('.stat-icon');

        if (isEditMode) {
            statValues.forEach(value => {
                const input = document.createElement('input');
                input.type = 'number';
                input.value = value.textContent;
                input.min = 1;
                input.max = 1000;

                validateNumberInput(input);
                value.replaceWith(input);
            });

            enableImageEditing(avatarImages);
            enableImageEditing(statIcons);
        } else {
            const inputs = document.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                const span = document.createElement('span');
                span.classList.add('stat-value');
                span.textContent = input.value;
                input.replaceWith(span);
            });
        }
    });
});

// Функция генерации страницы
function generatePage() {
    const blocks = [
        new TextBlock("Имя персонажа", CHARACTER_DATA.name),
        new ImageBlock("Класс", CHARACTER_DATA.classImage),
        new LevelBlock(CHARACTER_DATA.level),
        new BasePowerBlock(CHARACTER_DATA.basePower.hp, CHARACTER_DATA.basePower.fp, CHARACTER_DATA.basePower.stamina),
        new StatBlock("Характеристики", CHARACTER_DATA.stats, ICONS.stats)
    ];

    const container = document.getElementById("profile-container");
    blocks.forEach(block => container.innerHTML += block.render());
}




async function fetchJoke() {
    try {
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        if (!response.ok) throw new Error("Ошибка загрузки шутки");

        const data = await response.json();
        document.getElementById("profile-container").innerHTML = `
            <h2>Случайная шутка</h2>
            <p>${data.setup} <strong>${data.punchline}</strong></p>
        `;
    } catch (error) {
        document.getElementById("profile-container").innerHTML = `<p>Ошибка: ${error.message}</p>`;
    }
}

document.getElementById("menu-jokes").addEventListener("click", fetchJoke);



async function fetchDogImage() {
    try {
        const response = await fetch("https://random.dog/woof.json");
        if (!response.ok) throw new Error("Ошибка загрузки изображения собаки");

        const data = await response.json();
        document.getElementById("profile-container").innerHTML = `
            <h2>Картинки с собачками</h2>
            <img src="${data.url}" alt="Собака" style="max-width: 100%; height: auto; border-radius: 10px;">
        `;
    } catch (error) {
        document.getElementById("profile-container").innerHTML = `<p>Ошибка: ${error.message}</p>`;
    }
}

document.getElementById("menu-dogs").addEventListener("click", fetchDogImage);


const reqresApiUrl = "https://reqres.in/api/users";

async function fetchReqresData() {
    try {
        document.getElementById("profile-container").innerHTML = "<p>Загружаем данные...</p>";

        const response = await fetch(reqresApiUrl);
        if (!response.ok) throw new Error("Ошибка загрузки данных с Reqres");

        const data = await response.json();
        displayUsers(data.data);
        displayActionButtons();
    } catch (error) {
        document.getElementById("profile-container").innerHTML = `<p>Ошибка: ${error.message}</p>`;
    }
}

function displayUsers(users) {
    const container = document.getElementById("profile-container");
    let usersListHTML = `<h2>Пользователи Reqres</h2><ul id="reqres-users-list">`;

    users.forEach(user => {
        usersListHTML += `
            <li id="user-${user.id}">
                <strong>${user.first_name} ${user.last_name}</strong> - ${user.email}
            </li>
        `;
    });

    usersListHTML += `</ul>`;
    container.innerHTML = usersListHTML;
}

function displayActionButtons() {
    const container = document.getElementById("profile-container");
    const buttonsHTML = `
        <button id="create-user">Создать пользователя (POST)</button>
        <button id="update-user">Обновить пользователя (PUT)</button>
        <button id="partial-update-user">Частичное обновление пользователя (PATCH)</button>
        <button id="delete-user">Удалить пользователя (DELETE)</button>
    `;
    container.innerHTML += buttonsHTML;

    document.getElementById("create-user").addEventListener("click", createUser);
    document.getElementById("update-user").addEventListener("click", updateUser);
    document.getElementById("partial-update-user").addEventListener("click", partialUpdateUser);
    document.getElementById("delete-user").addEventListener("click", deleteUser);
}

document.getElementById("menu-reqres").addEventListener("click", fetchReqresData);

function showMessage(title, content, isError = false) {
    const messageContainer = document.getElementById("messages");
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error' : 'success';
    messageDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
    `;

    messageContainer.appendChild(messageDiv);

    // Устанавливаем таймер для удаления сообщения через 3 секунды
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

let currentUserId = null;
let isCreatingUser = false; // Флаг, указывающий, что пользователь создается

async function createUser() {
    if (isCreatingUser) {
        showMessage("Предупреждение", "Пожалуйста, дождитесь завершения предыдущего создания пользователя или удалите существующего.", true);
        return; // Прерываем выполнение функции
    }

    if (currentUserId) {
        showMessage("Предупреждение", "Удалите текущего пользователя перед созданием нового.", true);
        return; // Прерываем выполнение функции
    }

    isCreatingUser = true; // Устанавливаем флаг

    try {
        const response = await fetch(reqresApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "John Doe",
                email: "john.doe@reqres.in"
            })
        });

        if (!response.ok) throw new Error("Ошибка создания пользователя");

        const data = await response.json();
        console.log("Ответ сервера на POST запрос:", data);

        currentUserId = data.id;

        // Добавляем нового пользователя в список вручную
        const userList = document.getElementById("reqres-users-list");
        if (userList) {
            const newUserLi = document.createElement('li');
            newUserLi.id = `user-${data.id}`;
            newUserLi.innerHTML = `<strong>${data.name}</strong> - ${data.email}`;
            userList.appendChild(newUserLi);
        } else {
            const userListContainer = document.createElement('div'); // Создаем div для списка и заголовка
            userListContainer.innerHTML = `<h2>Пользователи Reqres</h2><ul id="reqres-users-list"></ul>`;
            document.getElementById("profile-container").appendChild(userListContainer);
            const userList = document.getElementById("reqres-users-list");

            const newUserLi = document.createElement('li');
            newUserLi.id = `user-${data.id}`;
            newUserLi.innerHTML = `<strong>${data.name}</strong> - ${data.email}`;
            userList.appendChild(newUserLi);
        }

        showMessage(
            "Пользователь успешно создан",
            `Имя: ${data.name}<br>Email: ${data.email}<br>ID: ${data.id}`
        );

    } catch (error) {
        console.error("Ошибка при создании пользователя:", error);
        showMessage("Ошибка", error.message, true);
    } finally {
        isCreatingUser = false; // Сбрасываем флаг в любом случае
    }
}


async function updateUser() {
    try {
        if (!currentUserId) {
            throw new Error("Сначала создайте пользователя");
        }

        const response = await fetch(`${reqresApiUrl}/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Jane Doe",
                email: "jane.doe@reqres.in"
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка обновления: ${response.status}`);
        }

        const data = await response.json();
        console.log("Данные после обновления:", data);

        // Обновляем элемент в списке
        const userElement = document.getElementById(`user-${currentUserId}`);
        if (userElement) {
            userElement.innerHTML = `
                <strong>${data.name}</strong> - ${data.email}
            `;
        } else {
            console.error("Элемент пользователя не найден");
        }

        showMessage("Успешное обновление", `
            Имя: ${data.name}<br>
            Email: ${data.email}
        `);

    } catch (error) {
        console.error("Ошибка при обновлении:", error);
        showMessage("Ошибка", error.message, true);
    }
}

async function partialUpdateUser() {
    try {
        if (!currentUserId) {
            throw new Error("Сначала создайте пользователя");
        }

        const response = await fetch(`${reqresApiUrl}/${currentUserId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "jane@reqres.in" })
        });

        if (!response.ok) throw new Error("Ошибка обновления");

        const data = await response.json();
        showMessage("Частичное обновление", `
            Новый email: ${data.email}
        `);

        // Обновляем только email
        const userElement = document.getElementById(`user-${currentUserId}`);
        if (userElement) {
            const currentName = userElement.querySelector("strong").textContent;
            userElement.innerHTML = `
                <strong>${currentName}</strong> - ${data.email}
            `;
        }

    } catch (error) {
        showMessage("Ошибка", error.message, true);
    }
}


async function deleteUser() {
    try {
        if (!currentUserId) {
            throw new Error("Сначала создайте пользователя");
        }

        const response = await fetch(`${reqresApiUrl}/${currentUserId}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Ошибка удаления: ${response.status}`);
        }

        // Удаляем элемент из списка
        const userElement = document.getElementById(`user-${currentUserId}`);
        if (userElement) {
            userElement.remove();
        } else {
            console.error("Элемент пользователя не найден");
        }

        currentUserId = null;
        showMessage("Успешное удаление", `Пользователь ID:${currentUserId} удален`);

    } catch (error) {
        console.error("Ошибка при удалении:", error);
        showMessage("Ошибка", error.message, true);
    }
}

document.getElementById("menu-home").addEventListener("click", () => {
    location.reload(); // Перезагружает страницу
});

document.addEventListener("DOMContentLoaded", generatePage);

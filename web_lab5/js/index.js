// Базовый класс блока
class Block {
    constructor(title) {
        this.title = title;
    }

    render() {
        return `<div class="block"><h3>${this.title}</h3></div>`;
    }
}

// Текстовый блок
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
                    <li class="stat-item">
                        <span class="stat-name">${this.text}</span>
                    </li>
                </ul>
            </div>`;
    }
}

// Блок с изображением
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
                    <li class="stat-item">
                        <img src="${this.imageUrl}" alt="${this.title}" class="avatar-image">
                    </li>
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
        let statsHtml = Object.entries(this.stats)
            .map(([key, value]) => `
                <li class="stat-item">
                    <img src="${this.icons[key]}" alt="${key}" class="stat-icon">
                    <span class="stat-name">${key}</span>
                    <span class="stat-value">${value}</span>
                </li>`)
            .join("");

        return `
            <div class="block stat-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    ${statsHtml}
                </ul>
            </div>`;
    }
}

class LevelBlock extends Block {
    constructor(level, icons) {
        super("Уровень");
        this.level = level;
        this.icons = icons;
    }

    render() {
        return `
            <div class="block level-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    <li class="stat-item">
                        <img src="${this.icons.level}" alt="Уровень" class="stat-icon">
                        <span class="stat-name">Текущий уровень</span>
                        <span class="stat-value">${this.level}</span>
                    </li>
                </ul>
            </div>`;
    }
}

class BasePowerBlock extends Block {
    constructor(hp, fp, stamina, icons) {
        super("Базовая сила");
        this.hp = hp;
        this.fp = fp;
        this.stamina = stamina;
        this.icons = icons;
    }

    render() {
        return `
            <div class="block base-power-block">
                <h3 class="block-title">${this.title}</h3>
                <ul class="stat-list">
                    <li class="stat-item">
                        <img src="${this.icons.hp}" alt="ОЗ (HP)" class="stat-icon">
                        <span class="stat-name">ОЗ (HP)</span>
                        <span class="stat-value">${this.hp}</span>
                    </li>
                    <li class="stat-item">
                        <img src="${this.icons.fp}" alt="ОК (FP)" class="stat-icon">
                        <span class="stat-name">ОК (FP)</span>
                        <span class="stat-value">${this.fp}</span>
                    </li>
                    <li class="stat-item">
                        <img src="${this.icons.stamina}" alt="Выносливость" class="stat-icon">
                        <span class="stat-name">Выносливость</span>
                        <span class="stat-value">${this.stamina}</span>
                    </li>
                </ul>
            </div>`;
    }
}

// Функция сборки страницы
function generatePage() {

    const levelIcons = {
        "level": "img//level.webp"
    };
    
    const basePowerIcons = {
        "hp": "img//hp.webp",
        "fp": "img//fp.webp",
        "stamina": "img//stamina.webp"
    };

    const icons = {
        "Жизненная сила": "img//vigor.webp",
        "Учёность": "img//attunement.webp",
        "Стойкость": "img//endurance.webp",
        "Физическая мощь": "img//vitality.webp",
        "Сила": "img//strength.webp",
        "Ловкость": "img//dexterity.webp",
        "Интеллект": "img//intelligence.webp",
        "Вера": "img//faith.webp",
        "Удача": "img//luck.webp",
    };

    const blocks = [
        new TextBlock("Имя персонажа", "Cetaera"),
        new ImageBlock("Класс", "img//sorcerer.webp"),
        new LevelBlock(68, levelIcons),
        new BasePowerBlock(828, 136, 111, basePowerIcons),
        new StatBlock("Характеристики", {
            "Жизненная сила": 21,
            "Учёность": 18,
            "Стойкость": 15,
            "Физическая мощь": 11,
            "Сила": 22,
            "Ловкость": 20,
            "Интеллект": 30,
            "Вера": 8,
            "Удача": 12
        }, icons) // Передаем объект с иконками
    ];

    // Получаем контейнер
    const container = document.getElementById("profile-container");

    // Добавляем все блоки в контейнер
    blocks.forEach(block => {
        container.innerHTML += block.render();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const editButton = document.createElement('button');
    editButton.textContent = '🖊️'; // Эмодзи карандаша
    editButton.id = 'editButton';
    editButton.style.position = 'absolute';
    editButton.style.top = '25px';
    editButton.style.right = '25px';
    header.appendChild(editButton);
    

    editButton.addEventListener('click', function() {
        document.body.classList.toggle('edit-mode');
        
        if (document.body.classList.contains('edit-mode')) {
            // Активируем редактирование всех полей
            const statValues = document.querySelectorAll('.stat-value');
            const statNames = document.querySelectorAll('.stat-name');
            const avatarImages = document.querySelectorAll('.avatar-image');
            const blockTitles = document.querySelectorAll('.block-title');
            const statIcons = document.querySelectorAll('.stat-icon'); 

            statValues.forEach(value => {
                const input = document.createElement('input');
                input.type = 'number';
                input.value = value.textContent;
                input.min = 1;
                input.max = 1000;
            
                value.replaceWith(input);
            
                input.addEventListener('input', function() {
                    if (input.value < 0) {
                        alert("Значение не может быть меньше 1.");
                        input.value = 1; 
                    }
                    if (input.value > 1000) {
                        alert("Значение не может быть больше 1000.");
                        input.value = 1000;
                    }
                    if (input.value.trim() === '') { 
                        alert("Поле не может быть пустым.");
                        input.value = value.textContent; // Восстанавливаем старое значение
                    }
                });
            });

            statNames.forEach(name => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = name.textContent;

                name.replaceWith(input);
                
                input.addEventListener('input', function() {
                    input.value = input.value.replace(/\d/g, ''); // Убираем цифры
            
                    if (input.value.length > 16) {
                        alert("Длина названия не должна превышать 16 символов.");
                        input.value = input.value.substring(0, 16); // Обрезаем до 16 символов
                    }

                    if (input.value.trim() === '') { 
                        alert("Поле не может быть пустым.");
                        input.value = name.textContent; // Восстанавливаем старое значение
                    }
                });

            });

            avatarImages.forEach(image => {
                image.addEventListener('click', function() {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                
                    input.addEventListener('change', function() {
                        if (input.files.length > 0) {
                            const file = input.files[0];
                            if (file.type.includes('image')) {
                                if (file.size > 1024 * 1024 * 5) { // Ограничение размера до 5 МБ
                                    alert("Размер изображения превышает 5 МБ.");
                                    return;
                                }
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    image.src = e.target.result;
                                };
                                reader.readAsDataURL(file);
                            } else {
                                alert("Выбранный файл не является изображением.");
                            }
                        }
                    });
                
                    // Показать диалоговое окно для выбора файла
                    input.click();
                });
            });

            statIcons.forEach(icon => {
                icon.addEventListener('click', function() {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                
                    input.addEventListener('change', function() {
                        if (input.files.length > 0) {
                            const file = input.files[0];
                            if (file.type.includes('image')) {
                                if (file.size > 1024 * 1024 * 5) { // Ограничение размера до 5 МБ
                                    alert("Размер иконки превышает 5 МБ.");
                                    return;
                                }
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    icon.src = e.target.result;
                                };
                                reader.readAsDataURL(file);
                            } else {
                                alert("Выбранный файл не является изображением.");
                            }
                        }
                    });
                
                    // Показать диалоговое окно для выбора файла
                    input.click();
                });
            });

            blockTitles.forEach(title => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = title.textContent;

                title.replaceWith(input);
                
                input.addEventListener('input', function() {
                    input.value = input.value.replace(/\d/g, ''); // Убираем цифры
            
                    if (input.value.length > 16) {
                        alert("Длина названия не должна превышать 16 символов.");
                        input.value = input.value.substring(0, 16); // Обрезаем до 16 символов
                    }
                    if (input.value.trim() === '') { 
                        alert("Поле не может быть пустым.");
                        input.value =title.textContent; // Восстанавливаем старое значение
                    }
                });
            
            });
            
        } else {
            // Отменяем редактирование всех полей
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.type === 'number') {
                    const statValue = document.createElement('span');
                    statValue.classList.add('stat-value');
                    statValue.textContent = input.value;
                    input.replaceWith(statValue);
                } else if (input.type === 'text') {
                    if (input.previousElementSibling && input.previousElementSibling.classList.contains('stat-icon')) {
                        const statName = document.createElement('span');
                        statName.classList.add('stat-name');
                        statName.textContent = input.value;
                        input.replaceWith(statName);
                    } else if (input.previousElementSibling && input.previousElementSibling.classList.contains('block-title')) {
                        const blockTitle = document.createElement('h3');
                        blockTitle.classList.add('block-title');
                        blockTitle.textContent = input.value;
                        blockTitle.style.fontSize = '1.3em';
                        input.replaceWith(blockTitle);
                    } else {
                        const statName = document.createElement('span');
                        statName.classList.add('stat-name');
                        statName.textContent = input.value;
                        input.replaceWith(statName);
                    }
                }
            });
        }
    });
});

// Запускаем генерацию страницы при загрузке
document.addEventListener("DOMContentLoaded", generatePage);

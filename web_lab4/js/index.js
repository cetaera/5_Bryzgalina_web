function showBanner() {
    document.getElementById("notification-banner").style.display = "block";
}

function closeBanner() {
    document.getElementById("notification-banner").style.display = "none";
    setTimeout(showBanner, 10000); // Через 10 секунд снова появится
}

function allowNotifications() {
    alert("Спасибо за разрешение! C вашей карты спишется 300 рублей 😊");
    closeBanner();
}

// Показать баннер через 5 секунд после загрузки страницы
setTimeout(showBanner, 5000);


document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        this.innerHTML = "☀️";
    } else {
        this.innerHTML = "🌙";
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const reviewsList = document.getElementById("reviews-list");
    const reviewForm = document.getElementById("review-form");
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const imageInput = document.getElementById("image");

    // Массив с отзывами по умолчанию
    let reviews = [
        { name: "Иван", text: "Я надел Изолятор и успел к дедлайну!", image: "" },
        { name: "Ольга", text: "Теперь я не слышу ни-че-го! Спасибо, Изолятор!", image: "" },
        { name: "Сергей", text: "Этот шлем спас мою курсовую работу!", image: "" },
        { name: "Андрей", text: "Друзья говорят, что я стал молчаливее. Ну и отлично!", image: "" }
    ];

    // Функция для отображения отзывов
    function renderReviews() {
        reviewsList.innerHTML = "";
        reviews.forEach((review) => {
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");

            const reviewText = document.createElement("p");
            reviewText.innerHTML = `<strong>${review.name}</strong>: ${review.text}`;

            reviewItem.appendChild(reviewText);

            if (review.image) {
                const reviewImage = document.createElement("img");
                reviewImage.src = review.image;
                reviewImage.alt = "Фото отзыва";
                reviewImage.style.width = "100px";  
                reviewImage.style.height = "60px"; 
                reviewImage.style.objectFit = "cover";
                reviewItem.appendChild(reviewImage);
            }

            reviewsList.appendChild(reviewItem);
        });
    }


    // Обработчик формы
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        // Валидация данных для имени (только буквы и пробелы)
        const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
        if (!namePattern.test(name)) {
            alert("Имя может содержать только буквы и пробелы!");
            return;
        }

        // Валидация длины 
        if (message.length < 5) {
            alert("Отзыв должен быть не короче 5 символов!");
            return;
        }
        if (message.length > 200) {
            alert("Отзыв не может быть длиннее 200 символов!");
            return;
        }

        let imageUrl = "";
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            imageUrl = URL.createObjectURL(file); 
        }

        // Добавляем новый отзыв в массив
        reviews.push({ name, text: message, image: imageUrl });

        // Очищаем форму
        nameInput.value = "";
        messageInput.value = "";
        imageInput.value = "";

        renderReviews();
    });

    renderReviews();
});


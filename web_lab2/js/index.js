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

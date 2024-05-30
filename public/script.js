document.addEventListener('DOMContentLoaded', function () {
    const likeForms = document.querySelectorAll('.like-button'); // Selecteer alle like-formulieren

    likeForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Voorkom standaard formulierverzending
            
            const likeButton = form.querySelector('.like-button'); // Selecteer de like-knop in het formulier
            const initiatiefId = likeButton.value; // Haal het initiatief-ID uit de waarde van de like-knop
            const likeCountElement = form.closest('li').querySelector('.like-count'); // Zoek het element dat het aantal likes toont
            const heartContainer = form.closest('li').querySelector('.hearts'); // Zoek de container voor hartjesanimatie
            let likes = parseInt(likeCountElement.textContent); // Haal het huidige aantal likes op en zet om naar een geheel getal

            // Toon hartjesanimatie
            heartContainer.classList.remove('hidden');

            // Verberg hartjes na animatie
            setTimeout(() => {
                heartContainer.classList.add('hidden');
            }, 3000); // duur van de animatie

            // Verstuur de like naar de server
            fetch('/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    initiatiefId: initiatiefId,
                    likes: likes // verstuur het oorspronkelijke aantal likes
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Netwerkrespons was niet ok');
                }
                return response.json();
            }).then(data => {
                if (data.success) {
                    // Update het aantal likes in de frontend
                    likeCountElement.textContent = data.newLikes;
                } else {
                    throw new Error('Fout bij het bijwerken van likes op de server');
                }
            }).catch((error) => {
                console.error('Error:', error);
                // Verberg hartjes bij een fout
                heartContainer.classList.add('hidden');
            });
        });
    });
});
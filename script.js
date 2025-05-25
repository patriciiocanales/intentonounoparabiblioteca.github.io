// script.js
document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const readingListBtn = document.getElementById('readingListBtn');
    const reviewsBtn = document.getElementById('reviewsBtn');
    const recommendationsBtn = document.getElementById('recommendationsBtn');

    readingListBtn.addEventListener('click', showReadingList);
    reviewsBtn.addEventListener('click', showReviews);
    recommendationsBtn.addEventListener('click', showRecommendations);

    function showReadingList() {
        content.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Lista de Lectura</h2>
            <input type="text" id="bookTitle" placeholder="Título del libro" class="p-2 mb-2 w-full">
            <input type="text" id="bookAuthor" placeholder="Autor del libro" class="p-2 mb-2 w-full">
            <button id="addBookBtn" class="bg-blue-500 p-2 text-white">Añadir Libro</button>
            <ul id="bookList" class="mt-4"></ul>
        `;
        loadBooks();
        document.getElementById('addBookBtn').addEventListener('click', addBook);
    }

    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '';
        books.forEach((book, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${book.title} - ${book.author} 
                <button onclick="markAsRead(${index})" class="text-green-500">Leído</button>
            `;
            bookList.appendChild(li);
        });
    }

    function addBook() {
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        if (title && author) {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            books.push({ title, author, read: false });
            localStorage.setItem('books', JSON.stringify(books));
            loadBooks();
            document.getElementById('bookTitle').value = '';
            document.getElementById('bookAuthor').value = '';
        }
    }

    window.markAsRead = function(index) {
        const books = JSON.parse(localStorage.getItem('books'));
        books[index].read = true;
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
    }

    function showReviews() {
        content.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Reseñas</h2>
            <select id="bookSelect" class="p-2 mb-2 w-full"></select>
            <div id="ratingSection" class="hidden">
                <h3 class="mt-4">Califica el libro</h3>
                ${[...Array(5)].map((_, i) => `
                    <div>
                        <label>${['Historia', 'Personajes', 'Estilo', 'Ritmo', 'Originalidad'][i]}: </label>
                        <select id="rating${i}" class="p-2 mb-2">
                            ${[1, 2, 3, 4, 5].map(num => `<option value="${num}">${num}</option>`).join('')}
                        </select>
                    </div>
                `).join('')}
                <textarea id="reviewText" placeholder="Escribe tu reseña" class="p-2 mb-2 w-full"></textarea>
                <button id="submitReviewBtn" class="bg-blue-500 p-2 text-white">Enviar Reseña</button>
            </div>
            <div id="reviewsList" class="mt-4"></div>
        `;
        loadBooksForReview();
        document.getElementById('submitReviewBtn').addEventListener('click', submitReview);
    }

    function loadBooksForReview() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const bookSelect = document.getElementById('bookSelect');
        bookSelect.innerHTML = '<option value="">Selecciona un libro</option>';
        books.forEach((book, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = book.title;
            bookSelect.appendChild(option);
        });
        bookSelect.addEventListener('change', () => {
            document.getElementById('ratingSection').classList.remove('hidden');
        });
    }

    function submitReview() {
        const bookIndex = document.getElementById('bookSelect').value;
        const ratings = [...Array(5)].map((_, i) => document.getElementById(`rating${i}`).value);
        const reviewText = document.getElementById('reviewText').value;

        if (bookIndex && ratings.every(r => r)) {
            const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
            reviews.push({ bookIndex, ratings, reviewText });
            localStorage.setItem('reviews', JSON.stringify(reviews));
            loadReviews();
        }
    }

    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = '';
        reviews.forEach((review, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                Reseña ${index + 1}: ${review.reviewText} 
                Calificaciones: ${review.ratings.join(', ')}
            `;
            reviewsList.appendChild(li);
        });
    }

    function showRecommendations() {
        content.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Recomendaciones</h2>
            <button id="generateRecommendationsBtn" class="bg-blue-500 p-2 text-white">Generar Recomendaciones</button>
            <div id="recommendationsList" class="mt-4"></div>
        `;
        document.getElementById('generateRecommendationsBtn').addEventListener('click', generateRecommendations);
    }

    function generateRecommendations() {
        // Aquí deberías implementar la lógica para cargar recomendaciones desde Google Sheets
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = 'Cargando recomendaciones...';
        // Simulación de recomendaciones
        setTimeout(() => {
            recommendationsList.innerHTML = `
                <div class="bg-gray-800 p-4 mb-2">
                    <h3>Título: Ejemplo de Libro</h3>
                    <p>Autor: Autor Ejemplo</p>
                    <p>Descripción: Una breve descripción del libro.</p>
                    <button class="bg-blue-500 p-2 text-white">Añadir a la Lista de Lectura</button>
                </div>
            `;
        }, 1000);
    }
});

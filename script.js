document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const readingListBtn = document.getElementById('readingListBtn');
    const reviewsBtn = document.getElementById('reviewsBtn');
    const recommendationsBtn = document.getElementById('recommendationsBtn');
    const syncGoogleSheetsBtn = document.getElementById('syncGoogleSheetsBtn');

    readingListBtn.addEventListener('click', showReadingList);
    reviewsBtn.addEventListener('click', showReviews);
    recommendationsBtn.addEventListener('click', showRecommendations);
    syncGoogleSheetsBtn.addEventListener('click', fetchBooksRead); // Agregar evento para sincronizar

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

    async function generateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = 'Cargando recomendaciones...';
        
        try {
            const res = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhu8rPgtpK7NF8j8O8Aq57IpFqaQtsaPE1r6uHKwM5EOkogdTu8cmwpmtz7IpSEPwqOBVVoPQThftN1DTlwk9aEwv820nFn5gjFxjzWVsjDVL5BEwC6MVr90tg4Xj5czoJTZhsrmxEkGoeHpX6hreflNidn9d9O1n3TykVb1VC2cEOCt3A-N_rhyB98UD2OY3jguUgdUAaSs7MjxVeZPKssj1tbNXh60gkYnoJUgeBLjjL4fFM6vz73J_dNkpB87i3X3O4ZPWlB_k1ingmvkYotzU0ht5HC8nZJGWXQ&lib=MvaPRDADU8LK6ygpMRVaYh5T3yILNd82e?sheet=Hoja 1');
            if (!res.ok) throw new Error("Error al cargar recomendaciones");
            const data = await res.json();
            
            recommendationsList.innerHTML = ''; // Limpiar la lista antes de mostrar nuevas recomendaciones

            // Filtrar 4 recomendaciones aleatorias
            const randomRecommendations = data.sort(() => 0.5 - Math.random()).slice(0, 4);

            randomRecommendations.forEach(rec => {
                const div = document.createElement('div');
                div.className = 'bg-gray-800 p-4 mb-2 text-white'; // Asegúrate de que el texto sea visible
                div.innerHTML = `
                    <h3 class="font-bold">Título: ${rec.Título}</h3>
                    <p>Autor: ${rec.Autor}</p>
                    <p>Descripción: ${rec.Descripción}</p>
                    <p>Información del Autor: ${rec.AutorInfo}</p>
                    <p>Premios: ${rec.Premios}</p>
                    <button class="bg-blue-500 p-2 text-white">Añadir a la Lista de Lectura</button>
                `;
                recommendationsList.appendChild(div);
            });
        } catch (err) {
            recommendationsList.innerHTML = 'Error al cargar recomendaciones.';
            console.error(err);
        }
    }

    // 4. Función para obtener libros leídos desde Google Sheets
    async function fetchBooksRead() {
        const res = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLilBzOt89ZbG_3TQ_SYkyxy9b1-6XhGhgJIGgtgOnh-zgnfhVj1EE2gRU2Cg-bX8HMib3-Zgwy_8cdAzuOilqlMuX1A_ztTyx06DM3BboonjnsqnD1TFhsw2Ph53Xwh0RaeRkbtHfhZpf7ApuwZfOZ_sGetEs2bzjaJy5Wlqc6f37vtjsDNqwjW_rfQuljKW2kJmt1fyA1qHEq_MCz-7uIokbTJAtidF3IgHlSqSWt4suN7nKumRywvbPZU-DIIJjA-4uODZeqhTtYmYjOmlX0tLpVlfSW87D-ssMPzTpsfYZ5oed7E_lnOU5SgFQ&lib=MvaPRDADU8LK6ygpMRVaYh5T3yILNd82e?action=getReadBooks');
        if (!res.ok) {
            console.error('Error al obtener libros leídos:', res.statusText);
            return;
        }
        const books = await res.json();
        displayBooks(books);
    }

    // 5. Función para mostrar los libros leídos en la interfaz
    function displayBooks(books) {
        content.innerHTML = '<h2 class="text-xl font-bold mb-4">Libros Leídos</h2>';
        const list = document.createElement('ul');
        list.className = 'space-y-4';

        if (books.length === 0) {
            list.innerHTML = '<li>No hay libros leídos registrados.</li>';
        } else {
            books.forEach(book => {
                const item = document.createElement('li');
                item.className = 'bg-gray-700 p-4 rounded shadow';
                item.innerHTML = `
                    <h3 class="text-xl font-semibold">${book.Título || book.title || 'Sin título'}</h3>
                    <p class="italic">Autor: ${book.Autor || book.author || 'Desconocido'}</p>
                    ${book.Descripción || book.description ? `<p>${book.Descripción || book.description}</p>` : ''}
                    ${book.Fecha || book.date ? `<p class="text-sm text-gray-400">Leído el: ${book.Fecha || book.date}</p>` : ''}
                `;
                list.appendChild(item);
            });
        }

        content.appendChild(list);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const readingListBtn = document.getElementById('readingListBtn');
    const reviewsBtn = document.getElementById('reviewsBtn');
    const recommendationsBtn = document.getElementById('recommendationsBtn');
    const booksBtn = document.getElementById('booksBtn'); // Botón para "Todos los Libros"
    const syncGoogleSheetsBtn = document.getElementById('syncGoogleSheetsBtn');

    booksBtn.addEventListener('click', showAllBooks);
    readingListBtn.addEventListener('click', showReadingList);
    reviewsBtn.addEventListener('click', showReviews);
    recommendationsBtn.addEventListener('click', showRecommendations);
    syncGoogleSheetsBtn.addEventListener('click', fetchBooksRead); // Agregar evento para sincronizar

    // 1. Mostrar todos los libros
    async function showAllBooks() {
        const books = await fetchBooksRead();
        displayBooks(books, 'Todos los Libros');
    }

    // 2. Mostrar libros leídos
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

    // 3. Mostrar recomendaciones
    function showRecommendations() {
        content.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Recomendaciones</h2>
            <div id="recommendationsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        `;
        fetchRecommendations(); // Llama a la función para obtener recomendaciones
    }

    // 4. Función para obtener libros leídos desde Google Sheets
    async function fetchBooksRead() {
        const res = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLilBzOt89ZbG_3TQ_SYkyxy9b1-6XhGhgJIGgtgOnh-zgnfhVj1EE2gRU2Cg-bX8HMib3-Zgwy_8cdAzuOilqlMuX1A_ztTyx06DM3BboonjnsqnD1TFhsw2Ph53Xwh0RaeRkbtHfhZpf7ApuwZfOZ_sGetEs2bzjaJy5Wlqc6f37vtjsDNqwjW_rfQuljKW2kJmt1fyA1qHEq_MCz-7uIokbTJAtidF3IgHlSqSWt4suN7nKumRywvbPZU-DIIJjA-4uODZeqhTtYmYjOmlX0tLpVlfSW87D-ssMPzTpsfYZ5oed7E_lnOU5SgFQ&lib=MvaPRDADU8LK6ygpMRVaYh5T3yILNd82e?action=getReadBooks');
        if (!res.ok) {
            console.error('Error al obtener libros leídos:', res.statusText);
            return [];
        }
        return await res.json();
    }

    // 5. Función para mostrar los libros leídos en la interfaz
    function displayBooks(books, sectionTitle) {
        content.innerHTML = `<h2 class="text-xl font-bold mb-4">${sectionTitle}</h2>`;
        const list = document.createElement('div');
        list.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

        if (books.length === 0) {
            list.innerHTML = '<p>No hay libros registrados.</p>';
        } else {
            books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'bg-gray-700 p-4 rounded shadow';
                card.innerHTML = `
                    <h3 class="text-xl font-semibold">${book.Título || book.title || 'Sin título'}</h3>
                    <p class="italic">Autor: ${book.Autor || book.author || 'Desconocido'}</p>
                    ${book.Descripción || book.description ? `<p>${book.Descripción || book.description}</p>` : ''}
                    ${book.Fecha || book.date ? `<p class="text-sm text-gray-400">Leído el: ${book.Fecha || book.date}</p>` : ''}
                `;
                list.appendChild(card);
            });
        }

        content.appendChild(list);
    }

    // 6. Función para obtener recomendaciones
    async function fetchRecommendations() {
        // Aquí puedes hacer una llamada a una API de libros para obtener recomendaciones
        // Por ahora, vamos a simularlo con un array de ejemplo
        const recommendations = [
            { Título: 'El Alquimista', Autor: 'Paulo Coelho', Descripción: 'Una novela sobre seguir tus sueños.' },
            { Título: 'Cien años de soledad', Autor: 'Gabriel García Márquez', Descripción: 'La historia de la familia Buendía.' },
            { Título: '1984', Autor: 'George Orwell', Descripción: 'Una distopía sobre el totalitarismo.' },
            { Título: 'Orgullo y prejuicio', Autor: 'Jane Austen', Descripción: 'Una novela sobre el amor y la sociedad.' }
        ];

        displayRecommendations(recommendations);
    }

    // 7. Función para mostrar recomendaciones en formato de tarjeta
    function displayRecommendations(recommendations) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = ''; // Limpiar la lista antes de mostrar nuevas recomendaciones

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 p-4 rounded shadow text-white';
            card.innerHTML = `
                <h3 class="font-bold">${rec.Título}</h3>
                <p>Autor: ${rec.Autor}</p>
                <p>${rec.Descripción}</p>
                <button class="bg-blue-500 p-2 text-white">Añadir a la Lista de Lectura</button>
            `;
            recommendationsList.appendChild(card);
        });
    }
});

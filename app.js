//ARRAYS
//==========================================================
let booksArray = []; //Initialize empty array to store books
let bookIdCounter = 1; //ID counter for unique book ID

//OBJECTS
//==========================================================
//Book object constructor for creating book objects
function createBook(title, author, year) {
    return {
        id: bookIdCounter++, //give unique id each time we create a new book
        title: title,
        author: author,
        year: parseInt(year), //converts a string to int
        isAvailable: true
    };
}

//Borrower class
function createBorrower(name, borrowerId) {
    return {
        name: name,
        borrowerId: borrowerId,
        borrowed: [],

        //Method: Borrow a book
        borrow(bookObj) {
            //check if book is not available
            if(!bookObj.isAvailable) {
                return `Cannot borrow "${bookObj.title}", book unavailable.`;
            }
            bookObj.isAvailable = false; //set isAvailable to false to indicate that it is borrowed
            this.borrowed.push(bookObj); //push the created book object into borrowed array
            return `${this.name} successfully borrowed "${bookObj.title}".`;
        },

        //Method: Return a book
        returnBook(title) {
            const index = this.borrowed.findIndex(book => book.title === title); //Find the index of the book with matching title in the borrowed array 
            if (index === -1) {
                return `Book "${title}" not found in borrowed list.`; //If book not found, findIndex returns -1
            }
            const book = this.borrowed[index]; //Get book object
            book.isAvailable = true; //Set isAvailable to true to indicate that the book is returned
            this.borrowed.splice(index, 1); //Remove from borrowed list (at index, remove 1 item)
            return `"${title}" returned successfully.`;
        },

        //Method: List all borrowed books
        listBorrowedBooks() {
            if (this.borrowed.length === 0){
                return `${this.name} has no borrowed books.`; //Check if array is empty
            }
            let report = `${this.name} borrowed books:\n`;
            this.borrowed.forEach((book, i) => {
                report += `${i + 1}. "${book.title}" by ${book.author} (${book.year})\n`; //Goes through each book in borrowed array and adds formatted line to the report
            });
            return report; //Return complete report
        }
    };
}

//CRUD OPERATIONS
//==========================================================
//ADD a book
function addBook(title, author, year){
    //For validation
    if (!title || !author || !year) {
        console.log("All fields are required!"); 
        return false;
    }

    const newBook = createBook(title, author, year); //Create new book object
    booksArray.push(newBook); //Push to booksArray
    console.log(`Added: "${title}" by ${author}`);
    return true;
}

// UPDATE a book (search by title)
function updateBook(searchTitle, newData) {
    //Searches for a book by title (case-sensitive)
    const book = booksArray.find(b => b.title.toLowerCase() === searchTitle.toLowerCase()); //find() returns the actual object (undefined if not found)
    
    if (!book) {
        console.log(`Book "${searchTitle}" not found.`);
        return false;
    }
    
    // Update properties
    if (newData.title) book.title = newData.title;
    if (newData.author) book.author = newData.author;
    if (newData.year) book.year = parseInt(newData.year); //convert string to int
    
    console.log(`Updated book: ${book.title}`);
    return true;
}

// DELETE a book
function deleteBook(bookId) {
    //Find index of book id
    const index = booksArray.findIndex(b => b.id === bookId); //Used id because some books may have the same title
    
    if (index === -1) {
        console.log("Book not found");
        return false;
    }
    
    const deleted = booksArray.splice(index, 1)[0]; //Get the removed OBJECT by using [0] because splice() returns an array.
    console.log(`Deleted: "${deleted.title}"`);
    return true;
}

// SEARCH with partial keywords
function searchBooks(keyword) {
    const lowerKeyword = keyword.toLowerCase(); //converts to lowercase
    //filter() goes through every book in the array and keeps only the ones that match your condition
    //returns a new array with only the matching books
    return booksArray.filter(book => 
        book.title.toLowerCase().includes(lowerKeyword) || //get book title -> make lowercase -> check if it contains keyword
        book.author.toLowerCase().includes(lowerKeyword)
    );
}

// FILTER books (published after 2015) FILTER RECENT
function filterRecentBooks() {
    return booksArray.filter(book => book.year > 2015); //goes through every book in the array and keeps only the ones from 2015 and up.
}

// SORT by year (numeric)
//(ascending = true) is a default parameter
//If you call sortByYear() with no argument → ascending is true, otherwise it is false
function sortByYear(ascending = true) {
    //... spread operator, spreads out the array items and creates a copy of the array because sort() modifies the original array
    return [...booksArray].sort((a, b) => 
        ascending ? a.year - b.year : b.year - a.year
    );
}

// SORT by title (string)
function sortByTitle(ascending = true) {
    return [...booksArray].sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (ascending) {
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        } else {
            return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
        }
    });
}

//CRUD OPERATIONS
//==========================================================
let currentView = 'table'; // 'table' or 'card'
let currentSort = { field: null, ascending: true };

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    document.getElementById('book-form').addEventListener('submit', handleAddBook);
    
    // Search input handler (live search)
    document.getElementById('search-input').addEventListener('input', handleSearch);
    
    // Add sample books for testing
    addSampleBooks();
    renderBooks(booksArray);
});

// Add sample books
function addSampleBooks() {
    addBook("The Great Gatsby", "F. Scott Fitzgerald", "1925");
    addBook("To Kill a Mockingbird", "Harper Lee", "1960");
    addBook("1984", "George Orwell", "1949");
    addBook("The Midnight Library", "Matt Haig", "2020");
    addBook("Educated", "Tara Westover", "2018");
    renderBooks(booksArray);
}

// Handle form submission
function handleAddBook(e) {
    e.preventDefault();
    
    const title = document.getElementById('title-input').value.trim();
    const author = document.getElementById('author-input').value.trim();
    const year = document.getElementById('year-input').value;
    
    if (addBook(title, author, year)) {
        // Clear form
        document.getElementById('book-form').reset();
        // Re-render
        renderBooks(booksArray);
    } else {
        alert('Please fill all fields correctly');
    }
}

// Handle search
function handleSearch(e) {
    const keyword = e.target.value.trim();
    if (keyword === '') {
        renderBooks(booksArray);
    } else {    
        const results = searchBooks(keyword);
        renderBooks(results);
        console.log(`Search results for "${keyword}":`, results);
    }
}

// Render books in DOM
function renderBooks(books) {
    const listContainer = document.getElementById('list');
    
    if (books.length === 0) {
        listContainer.innerHTML = '<p>No books found.</p>';
        updateSummary();
        return;
    }
    
    if (currentView === 'table') {
        renderTableView(books);
    } else {
        renderCardView(books);
    }
    
    updateSummary();
}

// Table view
function renderTableView(books) {
    const listContainer = document.getElementById('list');
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    books.forEach(book => {
        const rowClass = !book.isAvailable ? 'unavailable' : '';
        const borrowOrReturnBtn = book.isAvailable
            ? `<button class="borrow-btn" onclick="handleBorrow(${book.id})">Borrow</button>`
            : `<button class="return-btn" onclick="handleReturn(${book.id})">Return</button>`;

        html += `
            <tr class="${rowClass}">
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.isAvailable ? 'Available' : 'Borrowed'}</td>
                <td class="actions">
                    <div class="action-buttons">
                        ${borrowOrReturnBtn}
                        <button class="delete-btn" onclick="handleDelete(${book.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    listContainer.innerHTML = html;
}

// Card view
function renderCardView(books) {
    const listContainer = document.getElementById('list');
    let html = '';
    
    books.forEach(book => {
        const cardClass = !book.isAvailable ? 'book-card unavailable' : 'book-card';
        html += `
            <div class="${cardClass}">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <p><strong>Status:</strong> ${book.isAvailable ? 'Available' : 'Borrowed'}</p>
                <div>
                    ${book.isAvailable
                        ? `<button class="borrow-btn" onclick="handleBorrow(${book.id})">Borrow</button>`
                        : `<button class="return-btn" onclick="handleReturn(${book.id})">Return</button>`}
                    <button class="delete-btn" onclick="handleDelete(${book.id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
}

// Update summary section
function updateSummary() {
    const total = booksArray.length;
    const available = booksArray.filter(b => b.isAvailable).length;
    const borrowed = total - available;
    
    document.getElementById('total-books').textContent = total;
    document.getElementById('available-books').textContent = available;
    document.getElementById('borrowed-books').textContent = borrowed;
}

// Handle delete with confirmation
function handleDelete(bookId) {
    const book = booksArray.find(b => b.id === bookId);
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        deleteBook(bookId);
        renderBooks(booksArray);
    }
}

// Handle borrow
function handleBorrow(bookId) {
    const book = booksArray.find(b => b.id === bookId);
    const msg = testBorrower.borrow(book);
    alert(msg);
    renderBooks(booksArray);
}

// Handle return
function handleReturn(bookId) {
    const book = booksArray.find(b => b.id === bookId);
    const msg = testBorrower.returnBook(book.title);
    alert(msg);
    renderBooks(booksArray);
}

// Filter and display
function filterAndDisplay() {
    const filtered = filterRecentBooks();
    renderBooks(filtered);
    console.log('Books published after 2015:', filtered);
}

// Sort and display
function sortAndDisplay(field) {
    // Toggle ascending/descending
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }
    
    let sorted;
    if (field === 'year') {
        sorted = sortByYear(currentSort.ascending);
    } else {
        sorted = sortByTitle(currentSort.ascending);
    }
    
    renderBooks(sorted);
    console.log(`Sorted by ${field} (${currentSort.ascending ? 'ascending' : 'descending'}):`, sorted);
}

// Toggle view
function toggleView() {
    currentView = currentView === 'table' ? 'card' : 'table';
    renderBooks(booksArray);
    console.log(`View changed to: ${currentView}`);
}

// Reset display
function resetDisplay() {
    document.getElementById('search-input').value = '';
    currentSort = { field: null, ascending: true };
    renderBooks(booksArray);
    console.log('Display reset');
}

//Test Borrower Object
//==========================================================

// Create a test borrower
const testBorrower = createBorrower("Sample Borrower", "B001");

// Test borrowing
console.log("\n=== Testing Borrower Methods ===");
if (booksArray.length > 0) {
    console.log(testBorrower.borrow(booksArray[0]));
    console.log(testBorrower.listBorrowedBooks());
    
    // Try to borrow same book again
    console.log(testBorrower.borrow(booksArray[0]));
    
    // Return the book
    console.log(testBorrower.returnBook(booksArray[0].title));
}
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Configuration
const CSV_FILE_PATH = 'data/book-club.csv';
const TEMPLATE_FILE_PATH = 'templates/book-club-template.html';
const OUTPUT_FILE_PATH = 'book-club.html';

// Function to process the CSV and generate HTML
function generateBookClubHtml() {
    // Array to store book data
    const books = [];

    // Read and parse the CSV file
    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (book) => {
            // Add each book to our array
            books.push({
                name: book.Name,
                imageFileName: book.ImageFileName
            });
        })
        .on('end', () => {
            // Once we have all books, generate the HTML
            if (books.length === 0) {
                console.error('No books found in the CSV file');
                return;
            }

            // Read the HTML template
            fs.readFile(TEMPLATE_FILE_PATH, 'utf8', (err, template) => {
                if (err) {
                    console.error('Error reading template file:', err);
                    return;
                }

                // Get the currently reading book (first book in the CSV)
                const currentlyReading = books[0];

                // Generate HTML for the currently reading section
                const currentlyReadingHtml = `
        <h3>Currently Reading:</h3>
        <h4>${currentlyReading.name}</h4>
        <div class="book-image">
            <img src="images/books/${currentlyReading.imageFileName}" alt="${currentlyReading.name}">
        </div>`;

                // Generate HTML for the previous reads section
                let previousReadsHtml = '';

                // Skip the first book (currently reading) and use the rest for previous reads
                for (let i = 1; i < books.length; i++) {
                    const book = books[i];
                    previousReadsHtml += `
          <div class="book-card">
              <img src="images/books/${book.imageFileName}" alt="${book.name}">
              <p>${book.name}</p>
          </div>`;
                }

                // Replace placeholders in the template
                let finalHtml = template
                    .replace('{{CURRENTLY_READING}}', currentlyReadingHtml)
                    .replace('{{PREVIOUS_READS}}', previousReadsHtml);

                // Write the final HTML to the output file
                fs.writeFile(OUTPUT_FILE_PATH, finalHtml, (err) => {
                    if (err) {
                        console.error('Error writing output file:', err);
                        return;
                    }
                    console.log(`Book club HTML generated successfully at: ${OUTPUT_FILE_PATH}`);
                });
            });
        });
}

// Run the generator
generateBookClubHtml();
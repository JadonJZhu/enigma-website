# UCLA Enigma Club Website Project

## Project Overview

This is a website for UCLA's Enigma Club, which focuses on science fiction, fantasy, board games, and related activities. The site uses a content generation approach where static HTML pages are created from templates and data files.

## Project Structure

```
enigma-website/
├── data/                    # CSV data files with club information
├── generators/              # JavaScript files that generate HTML pages
├── images/                  # Images for the website
│   ├── books/               # Book cover images
│   ├── officers/            # Officer profile photos
│   └── photos/              # Photo gallery images organized by season-year
├── styles/                  # CSS stylesheets
└── templates/               # HTML templates
```

## How the Site Generation Works

This project uses a template-based approach where:

1. Data is stored in CSV files (in the `/data/` directory)
2. Templates define the structure of each page (in the `/templates/` directory)
3. Generator scripts read the data and templates, then create the final HTML pages

This approach makes it easy to update content without changing the site structure, which is perfect for a club website where officer information, events, and other content change regularly.

## Generator Scripts

Each JavaScript file in the `/generators/` directory is responsible for generating a specific HTML page:

### book-club.js

This script generates the `book-club.html` page by:
1. Reading book data from `data/book-club.csv`
2. Using the `book-club-template.html` template
3. Setting the current book (first in the CSV) as "Currently Reading"
4. Adding remaining books to the "Previous Reads" section
5. Outputting the final HTML to `book-club.html`

### events.js

This script generates the `events.html` page by:
1. Reading event data from `data/events.csv`
2. Grouping events by quarter (e.g., "Winter 2024", "Fall 2023")
3. Sorting quarters in reverse chronological order
4. Formatting events within each quarter
5. Replacing a placeholder in `events-template.html` with the generated event content
6. Outputting the final HTML to `events.html`

### officers.js

This script generates the `officers.html` page by:
1. Reading officer data from `data/officers.csv`
2. Creating HTML for each officer's card (with name, position, photo, and bio)
3. Replacing a placeholder in `officers-template.html` with these cards
4. Outputting the final HTML to `officers.html`

### photos.js

This script generates the `photos.html` page by:
1. Reading images from the `images/photos/` directory (organized in season-year folders)
2. Sorting the folders in reverse chronological order
3. Creating a photo slider section for each season
4. Replacing a placeholder in `photos-template.html` with the generated gallery sections
5. Outputting the final HTML to `photos.html`

## Template Files

The template files in `/templates/` provide the HTML structure for each page. They include:

- `book-club-template.html` - Template for the book club page
- `events-template.html` - Template for the events page
- `officers-template.html` - Template for the officers page
- `photos-template.html` - Template for the photos page

Each template contains placeholders (like `{{CURRENTLY_READING}}` or `<!-- OFFICERS_PLACEHOLDER -->`) that get replaced with dynamic content by the generator scripts.

## Data Files

The `/data/` directory contains CSV files that store the site's content:

- `book-club.csv` - Information about books (name, image filename)
- `events.csv` - Event schedule (quarter, week, date, name)
- `officers.csv` - Officer information (name, position, image filename, biography)

## Running the Generators

To generate or update the HTML pages, you'll need to run each generator script using Node.js:

```bash
# Make sure you're in the project root directory
node generators/book-club.js
node generators/events.js
node generators/officers.js
node generators/photos.js
```

Each script will read the corresponding data and template files, generate the HTML, and write it to the output file in the root directory.

## Static Pages

Some pages (like `index.html`, `contact-us.html`, `faq.html`, etc.) are static and not generated through this process. These pages can be modified directly.

## Modifying the Website

Here's how to make common changes:

### To update the book club page:
1. Edit the `data/book-club.csv` file
2. Run `node generators/book-club.js`

### To update events:
1. Edit the `data/events.csv` file
2. Run `node generators/events.js`

### To update officer information:
1. Edit the `data/officers.csv` file
2. Add/replace officer photos in `images/officers/`
3. Run `node generators/officers.js`

### To update the photo gallery:
1. Create or modify season-year folders in `images/photos/` (e.g., `winter-2024`)
2. Add photos to these folders
3. Run `node generators/photos.js`

## Dependencies

The project uses the following Node.js libraries:
- `fs` - For file system operations
- `path` - For path manipulations
- `csv-parser` - For parsing CSV files

Make sure these are installed:

```bash
npm install csv-parser
```

## Conclusion

This project uses a simple but effective approach for maintaining a club website. By separating content (data) from presentation (templates), it allows for easy updates to site content without requiring deep HTML knowledge. The generator scripts bridge these components, creating static HTML files that can be hosted on any web server.
const fs = require('fs');
const path = require('path');

// Configuration
const PHOTOS_DIR = 'images/photos';
const TEMPLATE_FILE = 'templates/photos-template.html';
const OUTPUT_FILE = 'photos.html';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

/**
 * Generates the photo gallery HTML from the photos directory
 */
function generatePhotoGallery() {
    try {
        // Read the template file
        const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

        // Get all season-year directories
        const seasonDirs = getSeasonDirectories();

        // Sort them in reverse chronological order
        seasonDirs.sort((a, b) => {
            // Extract year from both directories
            const yearA = parseInt(a.split('-')[1]);
            const yearB = parseInt(b.split('-')[1]);

            // Extract season from both directories
            const seasonA = a.split('-')[0].toLowerCase();
            const seasonB = b.split('-')[0].toLowerCase();

            // Define season order for sorting within the same year
            const seasonOrder = {
                'winter': 0,
                'spring': 1,
                'summer': 2,
                'fall': 3
            };

            // First compare years (in reverse order)
            if (yearA !== yearB) {
                return yearB - yearA;
            }

            // If years are the same, compare seasons (in reverse order within the year)
            return seasonOrder[seasonB] - seasonOrder[seasonA];
        });

        // Generate HTML for each season's gallery
        let galleriesHTML = '';

        seasonDirs.forEach(dir => {
            const images = getImagesInDirectory(path.join(PHOTOS_DIR, dir));

            // Skip if no images found
            if (images.length === 0) return;

            // Format the season-year for display (e.g., "Fall 2022")
            const [season, year] = dir.split('-');
            const formattedTitle = `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;

            // Create gallery section
            galleriesHTML += generateGallerySection(formattedTitle, dir, images);
        });

        // Replace the placeholder in the template with the generated galleries
        const outputHTML = template.replace('<!-- PHOTO_GALLERIES_PLACEHOLDER -->', galleriesHTML);

        // Write the output file
        fs.writeFileSync(OUTPUT_FILE, outputHTML);

        console.log(`Successfully generated ${OUTPUT_FILE} with ${seasonDirs.length} photo galleries.`);
    } catch (error) {
        console.error('Error generating photo gallery:', error);
    }
}

/**
 * Retrieves all season-year directories from the photos directory
 * @returns {Array} Array of directory names
 */
function getSeasonDirectories() {
    try {
        return fs.readdirSync(PHOTOS_DIR)
            .filter(item => {
                const stats = fs.statSync(path.join(PHOTOS_DIR, item));
                return stats.isDirectory() && /^[a-zA-Z]+-\d{4}$/.test(item);
            });
    } catch (error) {
        console.error('Error reading photos directory:', error);
        return [];
    }
}

/**
 * Gets all images in a directory
 * @param {string} dirPath Path to the directory
 * @returns {Array} Array of image filenames
 */
function getImagesInDirectory(dirPath) {
    try {
        return fs.readdirSync(dirPath)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return IMAGE_EXTENSIONS.includes(ext);
            });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        return [];
    }
}

/**
 * Generates HTML for a single gallery section
 * @param {string} title Section title
 * @param {string} dirName Directory name
 * @param {Array} images Array of image filenames
 * @returns {string} HTML for the gallery section
 */
function generateGallerySection(title, dirName, images) {
    // Start with the section header
    let html = `
    <!-- ${title} Photos -->
    <h4>${title}</h4>
    <div class="photo-slider">
        <div class="slider-container">
            <div class="slider-inner">`;

    // Add each image as a slide (make the first one active)
    images.forEach((image, index) => {
        const imagePath = `images/photos/${dirName}/${image}`;
        html += `
                <div class="slide${index === 0 ? ' active' : ''}">
                    <img src="${imagePath}" alt="${title} Event">
                </div>`;
    });

    // Add navigation buttons
    html += `
            </div>

            <button class="slider-prev">
                <svg viewBox="0 0 451.847 451.847">
                    <path
                        d="M97.141,225.92c0-8.095,3.091-16.192,9.259-22.366L300.689,9.27c12.359-12.359,32.397-12.359,44.751,0
                    c12.354,12.354,12.354,32.388,0,44.748L173.525,225.92l171.903,171.909c12.354,12.354,12.354,32.391,0,44.744
                    c-12.354,12.365-32.386,12.365-44.745,0l-194.29-194.281C100.226,242.115,97.141,234.018,97.141,225.92z">
                    </path>
                </svg>
            </button>
            <button class="slider-next">
                <svg viewBox="0 0 451.846 451.847">
                    <path
                        d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744
                    L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284
                    c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z">
                    </path>
                </svg>
            </button>
        </div>
    </div>`;

    return html;
}

// Run the generator
generatePhotoGallery();
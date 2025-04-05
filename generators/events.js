const fs = require('fs');
const path = require('path');
// Using csv-parser instead of csv-parse/sync
const csvParser = require('csv-parser');

// Configuration
const CSV_FILE = 'data/events.csv'
const TEMPLATE_FILE = 'templates/events-template.html'
const OUTPUT_FILE = 'events.html';

// Read and parse the CSV file
function parseEventsCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => {
                console.error('Error parsing CSV file:', error);
                reject(error);
            });
    });
}

// Group events by quarter
function groupEventsByQuarter(events) {
    const groupedEvents = {};

    events.forEach(event => {
        const quarter = event.Quarter;

        if (!groupedEvents[quarter]) {
            groupedEvents[quarter] = [];
        }

        groupedEvents[quarter].push(event);
    });

    return groupedEvents;
}

// Sort quarters in reverse chronological order
function sortQuarters(quarters) {
    // Expected format: "Season YYYY" (e.g., "Winter 2024", "Fall 2023")
    return quarters.sort((a, b) => {
        const yearA = parseInt(a.match(/\d{4}/)[0]);
        const yearB = parseInt(b.match(/\d{4}/)[0]);

        if (yearA !== yearB) {
            return yearB - yearA; // Sort by year in descending order
        }

        // If years are the same, sort by season
        const seasons = ['Winter', 'Fall', 'Summer', 'Spring'];
        const seasonA = a.split(' ')[0];
        const seasonB = b.split(' ')[0];

        return seasons.indexOf(seasonA) - seasons.indexOf(seasonB);
    });
}

// Generate HTML content for events
function generateEventsHTML(groupedEvents) {
    let html = '';

    // Get quarters sorted in reverse chronological order
    const quarters = sortQuarters(Object.keys(groupedEvents));

    quarters.forEach(quarter => {
        html += `<h3>${quarter}:</h3>\n<p>\n`;

        groupedEvents[quarter].forEach(event => {
            html += `    Week ${event.Week} (${event.Date}): ${event.Name}<br>\n`;
        });

        html += `</p>\n\n`;
    });

    return html;
}

// Generate the final HTML file
async function generateHtmlFile() {
    try {
        // Parse events from CSV
        const events = await parseEventsCSV(CSV_FILE);

        // Group events by quarter
        const groupedEvents = groupEventsByQuarter(events);

        // Generate events HTML content
        const eventsHtml = generateEventsHTML(groupedEvents);

        // Read template file
        let templateHtml = fs.readFileSync(TEMPLATE_FILE, 'utf8');

        // Replace placeholder with events content
        const finalHtml = templateHtml.replace('<!-- EVENTS_CONTENT -->', eventsHtml);

        // Write the final HTML to output file
        fs.writeFileSync(OUTPUT_FILE, finalHtml);

        console.log(`Events HTML successfully generated at: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error generating HTML file:', error);
        process.exit(1);
    }
}

// Execute the generation process
generateHtmlFile();
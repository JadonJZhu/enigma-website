const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Get the project root directory (one level up from the generators directory)
const projectRoot = path.join(__dirname, '..');

// Build absolute paths using the project root
const templatePath = path.join(projectRoot, 'templates', 'officers-template.html');
const csvFilePath = path.join(projectRoot, 'data', 'officers.csv');
const outputPath = path.join(projectRoot, 'officers.html');

// Read the template HTML file
const template = fs.readFileSync(templatePath, 'utf8');

// Array to hold all officers
const officers = [];

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        officers.push({
            name: row.Name,
            position: row.Position,
            imagePath: `images/officers/${row.ImageFileName}`, // Assuming images are in an 'images' folder
            bio: row.Biography
        });
    })
    .on('end', () => {
        console.log('CSV file successfully processed');

        // Generate HTML for all officers
        let officersHtml = '';

        officers.forEach(officer => {
            officersHtml += `
        <!-- Officer: ${officer.name} -->
        <div class="officer-card">
          <div class="officer-image">
            <img src="${officer.imagePath}" alt="${officer.name}" class="officer-image">
          </div>
          <div class="officer-info">
            <h3>${officer.name}</h3>
            <h4>(${officer.position})</h4>
            <p class="about-text">${officer.bio}</p>
          </div>
        </div>
        <div class="divider"></div>
      `;
        });

        // Replace the placeholder in the template with actual officers HTML
        const finalHtml = template.replace('<!-- OFFICERS_PLACEHOLDER -->', officersHtml);

        // Write to the final HTML file
        fs.writeFileSync(outputPath, finalHtml);

        console.log("officers.html has been generated!");
    });
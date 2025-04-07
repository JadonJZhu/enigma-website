const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

// List of all generator scripts to run
const scripts = [
    'generators/book-club.js',
    'generators/events.js',
    'generators/officers.js',
    'generators/photos.js'
];

console.log(`${colors.blue}=====================================${colors.reset}`);
console.log(`${colors.blue}  Enigma Website Build Process       ${colors.reset}`);
console.log(`${colors.blue}=====================================${colors.reset}`);

// Function to run a script and return a promise
function runScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`${colors.yellow}Running ${scriptName}...${colors.reset}`);

        // Use node to execute the script
        exec(`node ${scriptName}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`${colors.red}Error executing ${scriptName}:${colors.reset}`);
                console.error(error);
                return reject(error);
            }

            if (stderr) {
                console.log(`${colors.red}${scriptName} stderr:${colors.reset}`);
                console.error(stderr);
            }

            if (stdout) {
                console.log(`${colors.green}${scriptName} output:${colors.reset}`);
                console.log(stdout);
            }

            console.log(`${colors.green}Completed ${scriptName} successfully${colors.reset}`);
            resolve();
        });
    });
}

// Check if all scripts exist before running them
const missingScripts = scripts.filter(script => !fs.existsSync(script));

if (missingScripts.length > 0) {
    console.log(`${colors.red}Error: The following scripts were not found:${colors.reset}`);
    missingScripts.forEach(script => console.log(`${colors.red}- ${script}${colors.reset}`));
    console.log(`${colors.yellow}Make sure you're running this script from the correct directory.${colors.reset}`);
    process.exit(1);
}

// Run all scripts sequentially
async function buildWebsite() {
    console.log(`${colors.blue}Starting build process...${colors.reset}`);
    console.log(`${colors.blue}Found ${scripts.length} scripts to run${colors.reset}`);

    try {
        // Run each script in sequence
        for (const script of scripts) {
            await runScript(script);
        }

        console.log(`${colors.green}=====================================${colors.reset}`);
        console.log(`${colors.green}  Website build completed successfully!${colors.reset}`);
        console.log(`${colors.green}=====================================${colors.reset}`);
    } catch (error) {
        console.log(`${colors.red}=====================================${colors.reset}`);
        console.log(`${colors.red}  Build process failed!${colors.reset}`);
        console.log(`${colors.red}=====================================${colors.reset}`);
        process.exit(1);
    }
}

// Start the build process
buildWebsite();
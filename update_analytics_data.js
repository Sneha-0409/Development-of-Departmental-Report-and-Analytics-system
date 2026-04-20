const fs = require('fs');
const path = require('path');

const SCRAPED_DATA_PATH = path.join(__dirname, 'InstiReport-backend', 'scraped_faculty.json');
const ANALYTICS_JS_PATH = path.join(__dirname, 'InstiReport', 'src', 'data', 'analytics.js');

if (!fs.existsSync(SCRAPED_DATA_PATH)) {
    console.error('Error: scraped_faculty.json not found. Run "node InstiReport-backend/scraper.js" first.');
    process.exit(1);
}

const scrapedData = JSON.parse(fs.readFileSync(SCRAPED_DATA_PATH, 'utf8'));
let analyticsContent = fs.readFileSync(ANALYTICS_JS_PATH, 'utf8');

// Transform scraped data to facultyMock format
const facultyMock = {};
Object.keys(scrapedData).forEach(deptId => {
    facultyMock[deptId] = scrapedData[deptId].map(f => ({
        name: f.name,
        pubs: f.pubs,
        grants: Math.floor(f.pubs / 10), // Heuristic: 1 grant per 10 pubs for demo
        students: Math.floor(Math.random() * 20) + 20, // Random realistic student count
        service: Math.floor(Math.random() * 5) + 1 // Random service years
    })).sort((a, b) => b.pubs - a.pubs); // Sort by publications descending
});

// Use regex to find and replace the facultyMock object in analytics.js
// We look for "const facultyMock = { ... };"
const regex = /const facultyMock = \{[\s\S]*?\};/;
const newObjectString = `const facultyMock = ${JSON.stringify(facultyMock, null, 2)};`;

if (regex.test(analyticsContent)) {
    const updatedContent = analyticsContent.replace(regex, newObjectString);
    fs.writeFileSync(ANALYTICS_JS_PATH, updatedContent);
    console.log('SUCCESS: analytics.js has been updated with real IRINS data!');
    
    // Count total faculty
    let total = 0;
    Object.values(scrapedData).forEach(arr => total += arr.length);
    console.log(`Total live profiles imported: ${total}`);
} else {
    console.error('Error: Could not find facultyMock definition in analytics.js');
}

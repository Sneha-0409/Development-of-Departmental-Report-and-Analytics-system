const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mitsgwalior.irins.org';

const DEPARTMENTS = [
    { id: 'cse',   name: 'Computer Science and Engineering', slug: 'Department+of+Computer+Science+and+Engineering' },
    { id: 'it',    name: 'Information Technology', slug: 'Department+of+Information+Technology' },
    { id: 'ai',    name: 'Artificial Intelligence', slug: 'Department+of+Artificial+Intelligence' },
    { id: 'ee',    name: 'Electrical Engineering', slug: 'Department+of+Electrical+Engineering' },
    { id: 'me',    name: 'Mechanical Engineering', slug: 'Department+of+Mechanical+Engineering' },
    { id: 'civil', name: 'Civil Engineering', slug: 'Department+of+Civil+Engineering' },
    { id: 'ece',   name: 'Electronics Engineering', slug: 'Department+of+Electronics+Engineering' },
    { id: 'che',   name: 'Chemical Engineering', slug: 'Department+of+Chemical+Engineering' },
    { id: 'emc',   name: 'Engineering Mathematics and Computing', slug: 'Department+of+Engineering+Mathematics+and+Computing' }
];

async function scrapeDepartment(dept) {
    const url = `${BASE_URL}/faculty/index/${dept.slug}`;
    console.log(`Scraping ${dept.name} from ${url}...`);

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const facultyList = [];

        $('.cbp-item').each((i, el) => {
            const name = $(el).find('h3').text().trim();
            const designation = $(el).find('.color-lightYellow').text().trim();
            const profileLink = $(el).find('a.btn-u-sea').attr('href');
            
            // Extract publication count
            let pubs = 0;
            $(el).find('ul.share-list li').each((j, li) => {
                const text = $(li).text();
                if (text.includes('Publications')) {
                    const match = text.match(/\d+/);
                    if (match) pubs = parseInt(match[0]);
                }
            });

            if (name) {
                facultyList.push({
                    name,
                    designation,
                    pubs,
                    profileLink: profileLink ? profileLink : null,
                    departmentId: dept.id
                });
            }
        });

        console.log(`Found ${facultyList.length} faculty members in ${dept.name}`);
        return facultyList;
    } catch (error) {
        console.error(`Error scraping ${dept.name}:`, error.message);
        return [];
    }
}

async function runScraper() {
    const allData = {};

    for (const dept of DEPARTMENTS) {
        const faculty = await scrapeDepartment(dept);
        allData[dept.id] = faculty;
        // Adding a small delay to be polite to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const outputPath = path.join(__dirname, 'scraped_faculty.json');
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    console.log(`\nSUCCESS: Scraped data saved to ${outputPath}`);
    
    // Summary
    console.log('\n--- Summary ---');
    Object.keys(allData).forEach(id => {
        console.log(`${id.toUpperCase()}: ${allData[id].length} faculty members`);
    });
}

runScraper();

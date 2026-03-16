const fs = require('fs');

// Read the downloaded DB
const db = JSON.parse(fs.readFileSync('./exercises_test.json', 'utf8'));

// Build dictionary for mapping
const dbDict = {};
for (const ex of db) {
  if (ex.images && ex.images.length >= 2) {
    dbDict[ex.name] = ex.images;
  }
}

// Read the CURRENT exercises_full_data.js
let content = fs.readFileSync('./exercises_full_data.js', 'utf8');

// We will inject the dbDict into exercises_full_data.js as exImagesDb
const mapString = JSON.stringify(dbDict, null, 2);

// Replace the exerciseGifMap with the new one
const injection = `
  const exImagesDb = ${mapString};

  function getGifUrlAndImages(exerciseName) {
    const baseName = exerciseName.replace(/\\s*\\([^)]*\\)\\s*$/, '').trim();
    
    // First try standard exerciseGifMap
    let gifUrl = '';
    if (exerciseGifMap[baseName]) {
      gifUrl = 'https://v2.exercisedb.io/image/' + exerciseGifMap[baseName] + '/' + exerciseGifMap[baseName] + '.gif';
    } else {
      for (const [key, id] of Object.entries(exerciseGifMap)) {
        if (baseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(baseName.toLowerCase())) {
          gifUrl = 'https://v2.exercisedb.io/image/' + id + '/' + id + '.gif';
          break;
        }
      }
    }

    // Now try images map
    let images = [];
    const lowerBase = baseName.toLowerCase();
    
    // Exact match
    for (const [key, imgs] of Object.entries(exImagesDb)) {
        if (key.toLowerCase() === lowerBase || key.toLowerCase() === lowerBase + 's') {
            images = imgs.map(i => 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + i);
            break;
        }
    }
    
    // Partial Match
    if (images.length === 0) {
        for (const [key, imgs] of Object.entries(exImagesDb)) {
            if (lowerBase.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerBase)) {
                images = imgs.map(i => 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + i);
                break;
            }
        }
    }

    return { gifUrl, images };
  }
`;

// Replace `function getGifUrl(exerciseName) { ... }` with the injection
content = content.replace(/function getGifUrl\([\s\S]*?return ''(?:.*?)\s*\}/, injection);

fs.writeFileSync('./exercises_full_data.js', content, 'utf8');
console.log('Injection successful!');

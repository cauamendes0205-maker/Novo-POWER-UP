const fs = require('fs');

let content = fs.readFileSync('./exercises_full_data.js', 'utf8');

// The omercotkd/exercises-gifs repository contains the EXACT SAME FILES as ExerciseDB! 
// ExerciseDB IDs are something like "0025.gif". The repository just hosts them directly.
// So we just need to change "v2.exercisedb.io/image" to "raw.githubusercontent.com/omercotkd/exercises-gifs/main"

const injection = `
  const exImagesDb = {};
  const ptToEn = {};

  function getGifUrlAndImages(exerciseName) {
    const baseName = exerciseName.replace(/\\s*\\([^)]*\\)\\s*$/, '').trim();
    
    // First try standard exerciseGifMap
    let gifUrl = '';
    if (exerciseGifMap[baseName]) {
      // Use the open source GitHub mirror of ExerciseDB
      gifUrl = 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/exercises/' + exerciseGifMap[baseName] + '.gif';
    } else {
      for (const [key, id] of Object.entries(exerciseGifMap)) {
        if (baseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(baseName.toLowerCase())) {
          gifUrl = 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/exercises/' + id + '.gif';
          break;
        }
      }
    }

    return { gifUrl, images: [] }; // We no longer use images arrays, returning clean GIF url
  }
`;

content = content.replace(/const exImagesDb = [\s\S]*?return \{ gifUrl: '', images \};\s*\}/, injection);

fs.writeFileSync('./exercises_full_data.js', content, 'utf8');
console.log('Update Complete - Switched to true GIFs mirror!');

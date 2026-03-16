const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./exercises_test.json', 'utf8'));

// Build simple dictionary from Yuhonas
const exImagesDb = {};
for (const ex of db) {
    if (ex.images && ex.images.length >= 2) {
        exImagesDb[ex.name] = ex.images;
    }
}

// Hand-coded map for the base exercises used in PowerUp to Yuhonas names
const ptToEn = {
    'Supino reto': 'Barbell Bench Press',
    'Supino inclinado': 'Barbell Incline Bench Press',
    'Crucifixo reto': 'Dumbbell Flyes',
    'Crucifixo inclinado': 'Incline Dumbbell Flyes',
    'Dips': 'Dips - Chest Version',
    'Peck Deck': 'Butterfly',
    'Crossover': 'Cable Crossover',
    'Pull-over': 'Straight-Arm Pulldown',
    'Chest Press': 'Machine Bench Press',
    'Squeeze Press': 'Squeeze Press',

    'Puxada frente': 'Wide-Grip Lat Pulldown',
    'Remada baixa': 'Seated Cable Rows',
    'Remada unilateral': 'One-Arm Dumbbell Row',
    'Barra fixa': 'Pullups',
    'Pulldown': 'Wide-Grip Lat Pulldown',
    'Pullover': 'Straight-Arm Pulldown',
    'T-Bar Row': 'T-Bar Row',
    'Pendlay Row': 'Pendlay Row',
    'Remada curvada': 'Bent Over Barbell Row',
    'Remada sentado': 'Seated Cable Rows',

    'Agachamento': 'Barbell Squat',
    'Agachamento frontal': 'Front Barbell Squat',
    'Leg Press 45°': 'Leg Press',
    'Leg Press': 'Leg Press',
    'Cadeira extensora': 'Leg Extensions',
    'Avanço': 'Barbell Lunge',
    'Step-up': 'Dumbbell Step Ups',
    'Hack Squat': 'Hack Squat',
    'Goblet Squat': 'Goblet Squat',
    'Pistol Squat': 'Single-Leg Squat',
    'Wall Sit': 'Wall Sit',

    'Hip Thrust': 'Barbell Glute Bridge',
    'Glute Bridge': 'Glute Bridge',
    'Cable Kickback': 'Glute Kickback',
    'Donkey Kick': 'Glute Kickback',
    'Sumo Deadlift': 'Sumo Deadlift',
    'Romanian Deadlift': 'Romanian Deadlift',
    'Bulgarian Split Squat': 'Bulgarian Split Squat',
    'Cable Pull-Through': 'Pull Through',
    'Glute-Ham Raise': 'Glute Ham Raise',
    'Kettlebell Swing (Glúteo)': 'Kettlebell Swing',

    'Stiff': 'Stiff-Legged Barbell Deadlift',
    'Leg Curl (Máquina)': 'Seated Leg Curl',
    'Leg Curl': 'Seated Leg Curl',
    'Good Morning': 'Good Morning',
    'Nordic Hamstring': 'Glute Ham Raise',
    'Single-Leg RDL': 'Single-Leg Deadlift',
    'Swiss Ball Leg Curl': 'Leg Curl',
    'Cable Leg Curl': 'Standing Leg Curl',
    'Hip Hinge': 'Good Morning',

    'Desenvolvimento militar': 'Standing Military Press',
    'Elevação lateral': 'Side Lateral Raise',
    'Elevação frontal': 'Front Dumbbell Raise',
    'Reverse Fly': 'Reverse Flyes',
    'Arnold Press': 'Arnold Dumbbell Press',
    'Push Press': 'Push Press',
    'Machine Shoulder Press': 'Machine Shoulder (Military) Press',
    'Cable Lateral Raise': 'Cable Seated Lateral Raise',
    'Front Plate Raise': 'Front Plate Raise',
    'Cuban Press': 'Cuban Press',

    'Rosca direta': 'Barbell Curl',
    'Rosca alternada': 'Alternate Hammer Curl',
    'Rosca martelo': 'Hammer Curls',
    'Rosca concentrada': 'Concentration Curls',
    'Rosca Scott': 'Preacher Curl',
    'Rosca inclinada': 'Incline Dumbbell Curl',
    'Rosca 21s': 'Barbell Curl',
    'Rosca com cabo': 'Cable Hammer Curls',
    'Preacher Curl': 'Preacher Curl',
    'Zottman Curl': 'Zottman Curl',

    'Tríceps corda': 'Triceps Pushdown - Rope Attachment',
    'Tríceps testa': 'Lying Triceps Press',
    'Tríceps francês': 'Seated Triceps Press',
    'Supino pegada fechada': 'Close-Grip Barbell Bench Press',
    'Dips para tríceps': 'Tricep Dumbbell Kickback',
    'Kickback': 'Tricep Dumbbell Kickback',
    'Tricep Pressdown': 'Triceps Pushdown',
    'Overhead Tricep Extension': 'Standing Overhead Barbell Triceps Extension',
    'Skull Crusher': 'Lying Triceps Press',
    'Bench Dip': 'Bench Dips',

    'Prancha': 'Plank',
    'Prancha lateral': 'Side Plank',
    'Crunch': 'Crunches',
    'Crunch invertido': 'Reverse Crunch',
    'Hanging Leg Raise': 'Hanging Leg Raise',
    'Russian Twist': 'Russian Twist',
    'Cable Crunch': 'Cable Crunch',
    'Bicycle Crunch': 'Air Bike',
    'V-Up': 'Jackknife Get Up',
    'Dragon Flag': 'Dragon Flags',

    'Elevação de gêmeos em pé': 'Standing Calf Raises',
    'Elevação de gêmeos sentado': 'Seated Calf Raise',
    'Donkey Calf Raise': 'Donkey Calf Raises',
    'Single Leg Calf Raise': 'Calf Raise On A Dumbbell',
    'Seated Calf Press': 'Calf Press On The Leg Press Machine',
    'Calf Press on Leg Press': 'Calf Press On The Leg Press Machine',
    'Jump Rope': 'Rope Jump',
    'Farmer\'s Walk on Toes': 'Farmer\'s Walk',
    'Calf Hops': 'Rope Jump',
    'Tibialis Raise': 'Standing Calf Raises',

    'Clean and Press': 'Clean and Press',
    'Snatch': 'Snatch',
    'Kettlebell Swing': 'Kettlebell Swing',
    'Turkish Get-Up': 'Turkish Get-Up',
    'Farmer\'s Carry': 'Farmer\'s Walk',
    'Bear Crawl': 'Bear Crawl Fire',
    'Burpee': 'Burpee',
    'Man Makers': 'Burpee',
    'Thruster': 'Thruster',
    'Sled Push': 'Sled Push',

    'Máquina abdutor': 'Thigh Abductor',
    'Band Lateral Walk': 'Lateral Band Walk',
    'Clamshell': 'Clam',
    'Standing Hip Abduction': 'Standing Hip Abduction',
    'Cable Hip Abduction': 'Cable Hip Abduction',
    'Side-Lying Hip Abduction': 'Side-Lying Hip Abduction',
    'Cable Monster Walk': 'Lateral Band Walk',
    'Fire Hydrant': 'Hydrant',
    'Copenhagen Plank': 'Plank',
    'Lateral Box Step': 'Lateral Box Step',

    'Wrist Curl': 'Seated Dumbbell Palms-Up Wrist Curl',
    'Reverse Wrist Curl': 'Seated Dumbbell Palms-Down Wrist Curl',
    'Hammer Curl': 'Hammer Curls',
    'Plate Pinch': 'Plate Pinch',
    'Towel Hang': 'Towel Hang',
    'Wrist Roller': 'Wrist Roller',
    'Finger Curls': 'Finger Curls',
    'Grip Holds': 'Farmer\'s Walk',

    'Face Pull': 'Face Pull',
    'High Row': 'High Row',
    'Incline Row': 'Incline Row',
    'Meadow Row': 'Meadow Row',
    'Yates Row': 'Yates Row',
    'Seal Row': 'Seal Row',
    'Chest-Supported Row': 'Chest-Supported Row',
    'Rear Delt Row': 'Rear Delt Row',
    'Wide Grip Row': 'Wide Grip Row',
    'Low Cable Row': 'Seated Cable Rows',

    'Straight-Arm Pulldown': 'Straight-Arm Pulldown',
    'Lat Pulldown': 'Wide-Grip Lat Pulldown',
    'Close Grip Pulldown': 'Close-Grip Front Lat Pulldown',
    'Single-Arm Pulldown': 'One Arm Lat Pulldown',
    'Pulldown Behind Neck': 'Pulldown Behind Neck',
    'Lat Stretch Pullover': 'Straight-Arm Pulldown',
    'Assisted Pull-up': 'Machine Assisted Pull-Up',
    'Neutral Grip Pulldown': 'V-bar Pull Down',
    'V-Grip Pulldown': 'V-bar Pull Down',
    'Reverse Grip Pulldown': 'Underhand Cable Pulldowns',

    'Neck Flexion': 'Neck Flexion',
    'Neck Extension': 'Neck Extension',
    'Neck Lateral Flexion': 'Neck Lateral Flexion',
    'Weighted Neck Curl': 'Weighted Neck Curl',
    'Isometric Neck Hold': 'Isometric Neck Hold',
    'Neck Bridge': 'Neck Bridge',
    'Neck Rotations': 'Neck Rotations',
    'Chin Tuck': 'Chin Tuck',
    'Prone Neck Lift': 'Prone Neck Lift',
    'Neck Retractions': 'Neck Retractions',

    'Shrug (Barra)': 'Barbell Shrug',
    'Shrug (Halter)': 'Dumbbell Shrug',
    'Upright Row': 'Upright Barbell Row',
    'Farmer\'s Shrug': 'Farmer\'s Walk',
    'Dumbbell Shrug': 'Dumbbell Shrug',
    'Cable Shrug': 'Cable Shrugs',
    'Barbell High Pull': 'Barbell High Pull',
    'Smith Shrug': 'Smith Machine Shrug',
    'Sandbag Shrug': 'Sandbag Shrug',

    'Corrida': 'Running, Treadmill',
    'Remo indoor': 'Rowing, Stationary',
    'Bicicleta estática': 'Bicycling, Stationary',
    'Sprints': 'Running, Sprint',
    'Pular corda': 'Rope Jump',
    'Mountain Climbers': 'Mountain Climbers',
    'Battle Ropes': 'Battling Ropes',
    'Stair Climber': 'Stair Climber',
    'Rowing Intervals': 'Rowing, Stationary',

    'Máquina adutor': 'Thigh Adductor',
    'Cable Adduction': 'Cable Adductor',
    'Seated Adductor': 'Thigh Adductor',
    'Standing Adductor': 'Standing Adductor',
    'Copenhagen Adductor': 'Side Plank',
    'Side Lunge': 'Side Lunge',
    'Sumo Squat': 'Sumo Squat',
    'Adductor Raise': 'Adductor Raise',
    'Sliding Adductor': 'Sliding Adductor',
    'Weighted Inner Thigh Lift': 'Weighted Inner Thigh Lift'
};


let content = fs.readFileSync('./exercises_full_data.js', 'utf8');

const injection = `
  const exImagesDb = ${JSON.stringify(exImagesDb, null, 2)};
  const ptToEn = ${JSON.stringify(ptToEn, null, 2)};

  function getGifUrlAndImages(exerciseName) {
    const baseName = exerciseName.replace(/\\s*\\([^)]*\\)\\s*$/, '').trim();
    const enName = ptToEn[baseName];
    
    let images = [];
    if (enName && exImagesDb[enName]) {
        images = exImagesDb[enName].map(i => 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + i);
    } else {
        // Fallback fuzzy search if exact map fails
        const lowerBase = (enName || baseName).toLowerCase();
        for (const [key, imgs] of Object.entries(exImagesDb)) {
            if (key.toLowerCase().includes(lowerBase) || lowerBase.includes(key.toLowerCase())) {
                images = imgs.map(i => 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + i);
                break;
            }
        }
    }
    
    return { gifUrl: '', images };
  }
`;

content = content.replace(/const exImagesDb = [\s\S]*?return \{ gifUrl(,|\:)[\s\S]*?\};\s*\}/, injection);

fs.writeFileSync('./exercises_full_data.js', content, 'utf8');
console.log('Update Complete!');

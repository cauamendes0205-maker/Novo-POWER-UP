// Generated seed of 400 exercises for PowerUp
// With exercise demo GIF mapping system
(function () {
  // Muscle group visual mapping (for thumbnails and placeholders)
  const muscleGroupVisuals = {
    'Peito': { color: '#ef4444', icon: '💪', abbr: 'PE' },
    'Costas': { color: '#3b82f6', icon: '🔙', abbr: 'CO' },
    'Quadríceps': { color: '#22c55e', icon: '🦵', abbr: 'QU' },
    'Abdutores': { color: '#a855f7', icon: '🦿', abbr: 'AB' },
    'Antebraços': { color: '#f97316', icon: '💪', abbr: 'AN' },
    'Corpo Inteiro': { color: '#e16716', icon: '🏋️', abbr: 'CI' },
    'Costas Superiores': { color: '#06b6d4', icon: '🔙', abbr: 'CS' },
    'Dorsais': { color: '#0ea5e9', icon: '🔙', abbr: 'DO' },
    'Glúteos': { color: '#ec4899', icon: '🍑', abbr: 'GL' },
    'Isquiotibiais': { color: '#14b8a6', icon: '🦵', abbr: 'IS' },
    'Pescoço': { color: '#64748b', icon: '🧘', abbr: 'PS' },
    'Trapézio': { color: '#8b5cf6', icon: '💪', abbr: 'TR' },
    'Ombro': { color: '#f59e0b', icon: '💪', abbr: 'OM' },
    'Bíceps': { color: '#ef4444', icon: '💪', abbr: 'BI' },
    'Tríceps': { color: '#dc2626', icon: '💪', abbr: 'TC' },
    'Abdômen': { color: '#84cc16', icon: '🧘', abbr: 'AD' },
    'Panturrilha': { color: '#10b981', icon: '🦵', abbr: 'PA' },
    'Cardio': { color: '#f43f5e', icon: '❤️', abbr: 'CA' },
    'Adutores': { color: '#a78bfa', icon: '🦿', abbr: 'AT' }
  };

  // Exercise GIF URL map — maps exercise base name keywords to ExerciseDB GIF IDs
  // These are publicly hosted animated GIFs showing proper exercise form
  const exerciseGifMap = {
    // Chest
    // Chest
    'Supino reto (Barra)': '0025',
    'Supino reto (Halter)': '0289',
    'Supino reto': '0025',
    'Supino inclinado (Barra)': '0047',
    'Supino inclinado (Halter)': '0314',
    'Supino inclinado': '0047',
    'Crucifixo reto': '0308',
    'Crucifixo inclinado': '0319',
    'Dips': '0251',
    'Peck Deck': '0861',
    'Crossover': '1269',
    'Pull-over': '0372',
    'Chest Press': '0025',
    'Squeeze Press': '0289',
    // Back
    'Puxada frente (Cabo)': '0150',
    'Puxada frente': '0150',
    'Remada baixa (Máquina)': '0180',
    'Remada baixa': '0180',
    'Remada unilateral (Halter)': '0292',
    'Remada unilateral': '0292',
    'Barra fixa': '0651',
    'Pulldown': '0198',
    'Pullover': '0372',
    'T-Bar Row': '0597',
    'Pendlay Row': '3017',
    'Remada curvada (Barra)': '0027',
    'Remada curvada (Halter)': '0293',
    'Remada curvada': '0027',
    'Remada sentado': '0150',
    // Quadriceps
    'Agachamento (Barra)': '0043',
    'Agachamento (Halter)': '0413',
    'Agachamento': '0043',
    'Agachamento frontal': '0042',
    'Leg Press': '0740',
    'Cadeira extensora': '0585',
    'Avanço (Halter)': '0336',
    'Avanço': '0054',
    'Step-up': '0114',
    'Hack Squat': '0046',
    'Goblet Squat': '1760',
    'Pistol Squat': '1355',
    'Wall Sit': '1309',
    // Glutes
    'Hip Thrust': '1511',
    'Glute Bridge': '1409',
    'Cable Kickback': '0860',
    'Donkey Kick': '3304',
    'Sumo Deadlift (Barra)': '0117',
    'Sumo Deadlift': '0117',
    'Romanian Deadlift (Barra)': '0085',
    'Romanian Deadlift (Halter)': '1459',
    'Romanian Deadlift': '0085',
    'Bulgarian Split Squat': '0410',
    'Cable Pull-Through': '0659',
    'Glute-Ham Raise': '3297',
    // Hamstrings
    'Stiff (Barra)': '0085',
    'Stiff (Halter)': '1459',
    'Stiff': '0085',
    'Leg Curl': '0587',
    'Good Morning': '0044',
    'Nordic Hamstring': '0587',
    'Single-Leg RDL': '1756',
    // Shoulders
    'Desenvolvimento militar (Barra)': '0105',
    'Desenvolvimento militar (Halter)': '0405',
    'Desenvolvimento militar': '0105',
    'Desenvolvimento (Barra)': '0105',
    'Desenvolvimento (Halter)': '0405',
    'Elevação lateral (Halter)': '0334',
    'Elevação lateral (Cabo)': '0178',
    'Elevação lateral': '0334',
    'Elevação frontal (Halter)': '0312',
    'Elevação frontal (Anilha)': '0312',
    'Elevação frontal': '0312',
    'Reverse Fly': '0383',
    'Arnold Press': '0021',
    'Push Press': '0431',
    'Machine Shoulder Press': '0431',
    'Cuban Press': '0431',
    // Biceps
    'Rosca direta (Barra)': '0031',
    'Rosca direta (Halter)': '0294',
    'Rosca direta (Cabo)': '0868',
    'Rosca direta': '0031',
    'Rosca alternada (Halter)': '0285',
    'Rosca alternada': '0285',
    'Rosca martelo (Halter)': '0313',
    'Rosca martelo': '0313',
    'Rosca concentrada': '0297',
    'Rosca Scott': '0070',
    'Rosca inclinada': '0315',
    'Rosca 21s': '0031',
    'Rosca com cabo': '0868',
    'Preacher Curl': '0070',
    'Zottman Curl': '1672',
    // Triceps
    'Tríceps corda (Cabo)': '0200',
    'Tríceps corda': '0200',
    'Tríceps testa (Barra)': '0057',
    'Tríceps testa (Halter)': '0351',
    'Tríceps testa': '0057',
    'Tríceps francês': '0109',
    'Supino pegada fechada': '0030',
    'Dips para tríceps': '0139',
    'Kickback (Halter)': '0333',
    'Kickback': '0333',
    'Tricep Pressdown': '0200',
    'Overhead Tricep Extension': '0109',
    'Skull Crusher': '0060',
    'Bench Dip': '1399',
    // Abs
    'Prancha': '3327',
    'Prancha lateral': '0852',
    'Crunch': '0274',
    'Crunch invertido': '0274',
    'Hanging Leg Raise': '0432',
    'Russian Twist': '2135',
    'Cable Crunch': '0274',
    'Bicycle Crunch': '3658',
    'V-Up': '0274',
    'Dragon Flag': '0274',
    // Traps
    'Shrug': '0584',
    'Upright Row': '0148',
    'Face Pull': '0585',
    // Calves
    'Elevação de gêmeos em pé': '1384',
    'Elevação de gêmeos sentado': '1384',
    'Donkey Calf Raise': '1384',
    'Single Leg Calf Raise': '1384',
    'Jump Rope': '1160',
    // Core/Full Body
    'Clean and Press': '0431',
    'Snatch': '0431',
    'Kettlebell Swing': '3672',
    'Turkish Get-Up': '3672',
    'Burpee': '1160',
    'Thruster': '0431',
    // Cardio
    'Corrida': '1160',
    'Remo indoor': '0861',
    'Bicicleta estática': '1160',
    'Sprints': '1160',
    'Pular corda': '1160',
    'Mountain Climbers': '0658',
    'Battle Ropes': '1160',
    'Stair Climber': '0870'
  };

  // Function to find matching GIF URL for an exercise name



  const exImagesDb = {};
  const ptToEn = {};

  function getGifUrlAndImages(exerciseName) {
    // 1. Try match by EXACT full name (e.g. "Agachamento (Halter)")
    let gifId = exerciseGifMap[exerciseName];

    // 2. If no exact match, try stripping the equipment parenthesis and search base name
    if (!gifId) {
      const baseName = exerciseName.replace(/\s*\([^)]*\)\s*$/, '').trim();
      gifId = exerciseGifMap[baseName];

      // 3. Last resort: keyword search
      if (!gifId) {
        for (const [key, id] of Object.entries(exerciseGifMap)) {
          if (baseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(baseName.toLowerCase())) {
            gifId = id;
            break;
          }
        }
      }
    }

    const gifUrl = gifId ? 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/' + gifId + '.gif' : '';
    return { gifUrl, images: [] };
  }




  const groups = {
    Peito: [
      'Supino reto', 'Supino inclinado', 'Crucifixo reto', 'Crucifixo inclinado', 'Dips', 'Peck Deck', 'Crossover', 'Pull-over', 'Chest Press', 'Squeeze Press'
    ],
    Costas: [
      'Puxada frente', 'Remada baixa', 'Remada unilateral', 'Barra fixa', 'Pulldown', 'Pullover', 'T-Bar Row', 'Pendlay Row', 'Remada curvada', 'Remada sentado'
    ],
    "Quadríceps": [
      'Agachamento', 'Agachamento frontal', 'Leg Press 45°', 'Cadeira extensora', 'Avanço', 'Step-up', 'Hack Squat', 'Goblet Squat', 'Pistol Squat', 'Wall Sit'
    ],
    Abdutores: [
      'Máquina abdutor', 'Band Lateral Walk', 'Clamshell', 'Standing Hip Abduction', 'Cable Hip Abduction', 'Side-Lying Hip Abduction', 'Cable Monster Walk', 'Fire Hydrant', 'Copenhagen Plank', 'Lateral Box Step'
    ],
    Antebraços: [
      'Wrist Curl', 'Reverse Wrist Curl', 'Hammer Curl', 'Farmer\'s Walk', 'Plate Pinch', 'Towel Hang', 'Wrist Roller', 'Zottman Curl', 'Finger Curls', 'Grip Holds'
    ],
    "Corpo Inteiro": [
      'Clean and Press', 'Snatch', 'Kettlebell Swing', 'Turkish Get-Up', 'Farmer\'s Carry', 'Bear Crawl', 'Burpee', 'Man Makers', 'Thruster', 'Sled Push'
    ],
    "Costas Superiores": [
      'Face Pull', 'High Row', 'Incline Row', 'Meadow Row', 'Yates Row', 'Seal Row', 'Chest-Supported Row', 'Rear Delt Row', 'Wide Grip Row', 'Low Cable Row'
    ],
    Dorsais: [
      'Straight-Arm Pulldown', 'Lat Pulldown', 'Close Grip Pulldown', 'Single-Arm Pulldown', 'Pulldown Behind Neck', 'Lat Stretch Pullover', 'Assisted Pull-up', 'Neutral Grip Pulldown', 'V-Grip Pulldown', 'Reverse Grip Pulldown'
    ],
    Glúteos: [
      'Hip Thrust', 'Glute Bridge', 'Cable Kickback', 'Donkey Kick', 'Sumo Deadlift', 'Romanian Deadlift', 'Bulgarian Split Squat', 'Kettlebell Swing (Glúteo)', 'Cable Pull-Through', 'Glute-Ham Raise'
    ],
    Isquiotibiais: [
      'Stiff', 'Romanian Deadlift', 'Leg Curl (Máquina)', 'Good Morning', 'Nordic Hamstring', 'Single-Leg RDL', 'Glute Ham Raise', 'Swiss Ball Leg Curl', 'Cable Leg Curl', 'Hip Hinge'
    ],
    Pescoço: [
      'Neck Flexion', 'Neck Extension', 'Neck Lateral Flexion', 'Weighted Neck Curl', 'Isometric Neck Hold', 'Neck Bridge', 'Neck Rotations', 'Chin Tuck', 'Prone Neck Lift', 'Neck Retractions'
    ],
    Trapézio: [
      'Shrug (Barra)', 'Shrug (Halter)', 'Upright Row', 'Face Pull', 'Farmer\'s Shrug', 'Dumbbell Shrug', 'Cable Shrug', 'Barbell High Pull', 'Smith Shrug', 'Sandbag Shrug'
    ],
    Ombro: [
      'Desenvolvimento militar', 'Elevação lateral', 'Elevação frontal', 'Reverse Fly', 'Arnold Press', 'Push Press', 'Machine Shoulder Press', 'Cable Lateral Raise', 'Front Plate Raise', ' Cuban Press'
    ],
    Bíceps: [
      'Rosca direta', 'Rosca alternada', 'Rosca martelo', 'Rosca concentrada', 'Rosca Scott', 'Rosca inclinada', 'Rosca 21s', 'Rosca com cabo', 'Preacher Curl', 'Zottman Curl'
    ],
    Tríceps: [
      'Tríceps corda', 'Tríceps testa', 'Tríceps francês', 'Supino pegada fechada', 'Dips para tríceps', 'Kickback', 'Tricep Pressdown', 'Overhead Tricep Extension', 'Skull Crusher', 'Bench Dip'
    ],
    Abdômen: [
      'Prancha', 'Prancha lateral', 'Crunch', 'Crunch invertido', 'Hanging Leg Raise', 'Russian Twist', 'Cable Crunch', 'Bicycle Crunch', 'V-Up', 'Dragon Flag'
    ],
    Panturrilha: [
      'Elevação de gêmeos em pé', 'Elevação de gêmeos sentado', 'Donkey Calf Raise', 'Single Leg Calf Raise', 'Seated Calf Press', 'Calf Press on Leg Press', 'Jump Rope', 'Farmer\'s Walk on Toes', 'Calf Hops', 'Tibialis Raise'
    ],
    Cardio: [
      'Corrida', 'Remo indoor', 'Bicicleta estática', 'Sprints', 'Pular corda', 'Burpee', 'Mountain Climbers', 'Battle Ropes', 'Stair Climber', 'Rowing Intervals'
    ],
    Adutores: [
      'Máquina adutor', 'Cable Adduction', 'Seated Adductor', 'Standing Adductor', 'Copenhagen Adductor', 'Side Lunge', 'Sumo Squat', 'Adductor Raise', 'Sliding Adductor', 'Weighted Inner Thigh Lift'
    ]
  };

  const equipments = ['Barra', 'Halter', 'Cabo', 'Máquina', 'Peso corporal', 'Kettlebell', 'Anilha', 'Paralelas', 'Corda', 'Sled'];
  const levels = ['Iniciante', 'Intermediário', 'Avançado'];

  const out = [];
  const processedExercises = new Set();
  const groupKeys = Object.keys(groups);

  for (const g of groupKeys) {
    const names = groups[g];
    for (let i = 0; i < names.length; i++) {
      const base = names[i];

      // Select equipment logic - more logical mapping
      let selectedEquipments = [];
      if (base.toLowerCase().includes('máquina') || base.toLowerCase().includes('cable') || base.toLowerCase().includes('cabo')) {
        selectedEquipments = [base.toLowerCase().includes('cabo') ? 'Cabo' : 'Máquina'];
      } else if (base.toLowerCase().includes('halter') || base.toLowerCase().includes('dumbbell')) {
        selectedEquipments = ['Halter'];
      } else if (base.toLowerCase().includes('barra') || base.toLowerCase().includes('barbell')) {
        selectedEquipments = ['Barra'];
      } else if (['Agachamento', 'Supino reto', 'Supino inclinado', 'Desenvolvimento', 'Remada curvada', 'Rosca direta', 'Tríceps testa'].includes(base)) {
        // Essential exercises that have both Barra and Halter versions
        selectedEquipments = ['Barra', 'Halter'];
      } else if (['Prancha', 'Flexão', 'Burpee', 'Avanço', 'Agachamento frontal', 'Dips', 'Barra fixa'].includes(base)) {
        selectedEquipments = ['Peso corporal'];
      } else {
        // Default equipment based on muscle group or just a rotation
        const defaultEquip = equipments[i % equipments.length];
        selectedEquipments = [defaultEquip];
      }

      for (const equip of selectedEquipments) {
        const isBodyweight = equip === 'Peso corporal';
        const name = isBodyweight ? base : `${base} (${equip})`;

        // Prevent duplicates across groups (e.g. Romanian Deadlift in Glutes and Hamstrings)
        if (processedExercises.has(name.toLowerCase())) continue;
        processedExercises.add(name.toLowerCase());

        const idBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').replace(/^-+/, '');
        const id = `${idBase}`;
        const primary = g;
        const level = levels[processedExercises.size % levels.length];
        const visual = muscleGroupVisuals[primary] || { color: '#6b7280', abbr: '??' };

        out.push({
          id,
          name,
          primaryMuscleGroup: primary,
          secondaryMuscles: [],
          equipment: equip,
          level,
          description: `${name} - exercício para ${primary.toLowerCase()} com foco em execução técnica e controle.`,
          gifUrl: getGifUrlAndImages(name).gifUrl,
          images: [],
          muscleColor: visual.color,
          muscleAbbr: visual.abbr
        });
      }
    }
  }

  // Expose visuals and GIF map for external use
  window.MUSCLE_GROUP_VISUALS = muscleGroupVisuals;
  window.SEED_EXERCISES = out;
})();


const admin = require('firebase-admin');
const fs = require('fs');

// Carregar a chave de serviço
const serviceAccount = require('./firebase-service-account.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'powerup-a8304'
});

const db = admin.firestore();

// 10 Treinos Prontos (Categorizados)
const prebuiltWorkouts = [
  {
    id: 'tp_full_body_iniciante',
    name: 'Full Body Iniciante',
    description: 'Treino completo de adaptação neuromuscular ideal para começar a jornada na musculação.',
    category: 'Iniciante',
    difficulty: 'beginner',
    durationMinutes: 45,
    exercises: [
      { exerciseId: 'barbell_squat', name: 'Agachamento livre', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Foco na postura e cadência' },
      { exerciseId: 'bench_press', name: 'Supino reto com halteres', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Cotovelos não muito abertos' },
      { exerciseId: 'lat_pulldown', name: 'Puxada alta frente', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Alongar bem as dorsais' },
      { exerciseId: 'plank', name: 'Prancha', sets: 3, reps: '30s', restSeconds: 45, notes: 'Contrair abdómen e glúteos' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_hipertrofia_peito_triceps',
    name: 'Peito & Tríceps Foco',
    description: 'Rutina de hipertrofia concentrada empurre para máximo pump peitoral e de tríceps.',
    category: 'Hipertrofia',
    difficulty: 'intermediate',
    durationMinutes: 60,
    exercises: [
      { exerciseId: 'bench_press', name: 'Supino reto barra', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Aproximar à falha na última série' },
      { exerciseId: 'inc_bench_press', name: 'Supino inclinado halteres', sets: 4, reps: '10-12', restSeconds: 90, notes: 'Banco a 30 graus' },
      { exerciseId: 'dips', name: 'Fundos (Peito)', sets: 3, reps: 'Falha', restSeconds: 90, notes: 'Tronco ligeiramente inclinado' },
      { exerciseId: 'triceps_pushdown', name: 'Extensão tríceps corda', sets: 4, reps: '12-15', restSeconds: 60, notes: 'Abrir no fundo' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_hipertrofia_costas_biceps',
    name: 'Costas & Bíceps Densidade',
    description: 'Foco na espessura e largura dorsal combinado com estimulação dos flexores.',
    category: 'Hipertrofia',
    difficulty: 'intermediate',
    durationMinutes: 60,
    exercises: [
      { exerciseId: 'barbell_row', name: 'Remada curvada barra', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Costas retas, puxar na zona do umbigo' },
      { exerciseId: 'lat_pulldown', name: 'Puxada alta triângulo', sets: 4, reps: '10-12', restSeconds: 90, notes: 'Isometria no fundo' },
      { exerciseId: 'deadlift', name: 'Levantamento terra', sets: 3, reps: '6-8', restSeconds: 120, notes: 'Técnica perfeita essencial' },
      { exerciseId: 'bicep_curl', name: 'Curl bíceps barra W', sets: 4, reps: '10-12', restSeconds: 60, notes: 'Não usar balanço' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_hipertrofia_pernas',
    name: 'Pernas Volume Brutal',
    description: 'Treino exaustivo focado no desenvolvimento do quadricípite, posterior e glúteo.',
    category: 'Hipertrofia',
    difficulty: 'advanced',
    durationMinutes: 70,
    exercises: [
      { exerciseId: 'barbell_squat', name: 'Agachamento barra livre', sets: 5, reps: '8-10', restSeconds: 120, notes: 'Quebrar paralela' },
      { exerciseId: 'leg_press', name: 'Leg Press', sets: 4, reps: '12-15', restSeconds: 90, notes: 'Pés largura ombros' },
      { exerciseId: 'leg_extension', name: 'Extensora', sets: 3, reps: '15-20', restSeconds: 60, notes: 'Queima profunda, pausa em cima' },
      { exerciseId: 'leg_curl', name: 'Flexora deitada', sets: 4, reps: '10-12', restSeconds: 60, notes: 'Controlo excêntrico' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_forca_powerlifting',
    name: 'Big 3 Força Bruta',
    description: 'Programa focado no desenvolvimento de força neural nos movimentos base.',
    category: 'Força',
    difficulty: 'advanced',
    durationMinutes: 90,
    exercises: [
      { exerciseId: 'barbell_squat', name: 'Agachamento Low Bar', sets: 5, reps: '3-5', restSeconds: 180, notes: 'Carga de 85% 1RM' },
      { exerciseId: 'bench_press', name: 'Supino Reto Powerlifting', sets: 5, reps: '3-5', restSeconds: 180, notes: 'Leg drive forte' },
      { exerciseId: 'deadlift', name: 'Peso Morto', sets: 5, reps: '1-3', restSeconds: 240, notes: 'Evitar arredondar costas' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_cardio_hiit',
    name: 'Kettlebell HIIT',
    description: 'Intervalos metabólicos de alta densidade sem passadeiras. Queima rápida.',
    category: 'Cardio',
    difficulty: 'intermediate',
    durationMinutes: 25,
    exercises: [
      { exerciseId: 'kettlebell_swing', name: 'Kettlebell Swings', sets: 8, reps: '30s ativo/15s pausa', restSeconds: 15, notes: 'Explosão do quadril' },
      { exerciseId: 'burpees', name: 'Burpees', sets: 8, reps: '30s ativo/15s pausa', restSeconds: 15, notes: 'Salto no topo' },
      { exerciseId: 'mountain_climbers', name: 'Mountain Climbers', sets: 8, reps: '30s ativo/15s pausa', restSeconds: 15, notes: 'Ritmo máximo' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_mobilidade_matinal',
    name: 'Fluxo Matinal',
    description: 'Sessão de desbloqueio articular. Previne lesões e melhora a postura diária.',
    category: 'Mobilidade',
    difficulty: 'beginner',
    durationMinutes: 20,
    exercises: [
      { exerciseId: 'yoga_cat_cow', name: 'Cat Cow', sets: 3, reps: '10 transições', restSeconds: 15, notes: 'Respiração controlada' },
      { exerciseId: 'bodyweight_squat', name: 'Cócoras profundas', sets: 3, reps: '45s', restSeconds: 30, notes: 'Calcanhares no chão' },
      { exerciseId: 'lunges', name: 'Spider Lunge com Rotação', sets: 3, reps: '8 p/ lado', restSeconds: 30, notes: 'Abrir bem o peito' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_funcional_peso_corporal',
    name: 'Funcional Outdoor',
    description: 'Para treinar no parque ou em casa, resistência e controlo do próprio corpo.',
    category: 'Funcional',
    difficulty: 'intermediate',
    durationMinutes: 40,
    exercises: [
      { exerciseId: 'push_ups', name: 'Flexões de Braço', sets: 4, reps: '10-20', restSeconds: 60, notes: 'Variar a abertura' },
      { exerciseId: 'pull_ups', name: 'Elevações (Pull-ups)', sets: 4, reps: 'Max', restSeconds: 90, notes: 'Amplitude total' },
      { exerciseId: 'lunges', name: 'Lunges a caminhar', sets: 4, reps: '24 passos', restSeconds: 60, notes: 'Costas retas' },
      { exerciseId: 'dips', name: 'Fundos paralelhas', sets: 3, reps: '8-15', restSeconds: 60, notes: 'Usar banco ou parque' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_core_explosivo',
    name: 'Power Core',
    description: 'Rotina de estabilização do tronco cruzando abdominais e oblíquos.',
    category: 'Core',
    difficulty: 'intermediate',
    durationMinutes: 15,
    exercises: [
      { exerciseId: 'plank', name: 'Prancha com toques nos ombros', sets: 3, reps: '20 toques', restSeconds: 30, notes: 'Não rodar quadril' },
      { exerciseId: 'abs_crunch', name: 'V-Ups', sets: 3, reps: '12-15', restSeconds: 30, notes: 'Unir extremidades' },
      { exerciseId: 'russian_twists', name: 'Russian Twists', sets: 3, reps: '30 rodadas', restSeconds: 30, notes: 'Usar carga se possível' }
    ],
    isPrebuilt: true
  },
  {
    id: 'tp_resistencia_metabolico',
    name: 'Resistência Final',
    description: 'Circuito longo sem descanso entre estações para exaustão periférica.',
    category: 'Resistência',
    difficulty: 'advanced',
    durationMinutes: 45,
    exercises: [
      { exerciseId: 'bodyweight_squat', name: 'Jump Squats', sets: 4, reps: '20', restSeconds: 0, notes: 'Circuito - Sem pausa' },
      { exerciseId: 'push_ups', name: 'Push-ups em desnível', sets: 4, reps: '15', restSeconds: 0, notes: 'Circuito - Sem pausa' },
      { exerciseId: 'kettlebell_swing', name: 'Kettlebell Swing unilateral', sets: 4, reps: '12 p/ braço', restSeconds: 0, notes: 'Circuito - Sem pausa' },
      { exerciseId: 'battle_ropes', name: 'Battle Ropes', sets: 4, reps: '45s', restSeconds: 120, notes: 'Descanso de 2min no fim do circuito' }
    ],
    isPrebuilt: true
  }
];

async function addPrebuiltWorkouts() {
  try {
    console.log('🔄 Iniciando atualização dos Treinos Prontos...');

    // 1. Apagar colecção antiga
    const collectionRef = db.collection('prebuilt_workouts');
    const snapshot = await collectionRef.get();

    if (!snapshot.empty) {
      console.log(`🧹 A limpar ${snapshot.size} treinos antigos da base de dados...`);
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('✅ Base de dados antiga limpa.');
    } else {
      console.log('❕ A coleção já estava vazia.');
    }

    // 2. Inserir nova colecção
    let count = 0;
    const addBatch = db.batch();

    prebuiltWorkouts.forEach((workout) => {
      const docRef = collectionRef.doc(workout.id);
      addBatch.set(docRef, {
        id: workout.id,
        name: workout.name,
        description: workout.description,
        category: workout.category,
        difficulty: workout.difficulty,
        durationMinutes: workout.durationMinutes,
        exercises: workout.exercises,
        isPrebuilt: workout.isPrebuilt,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
    });

    await addBatch.commit();
    console.log(`✅ ${count} Treinos Prontos adicionados com sucesso!`);

  } catch (error) {
    console.error('❌ Erro no processo:', error);
  } finally {
    process.exit(0);
  }
}

addPrebuiltWorkouts();

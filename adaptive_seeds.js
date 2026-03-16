(function () {
  const adaptiveSeeds = [
    // --- PCD / WHEELCHAIR (20 Exercises) ---
    { name: "Prensa de Peito na Cadeira", group: "Peito", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Desenvolvimento de Ombro Sentado", group: "Ombro", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Rosca Biceps Adaptada", group: "Bíceps", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Extensão de Triceps Sentado", group: "Tríceps", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Puxada com Elástico no Poste", group: "Costas", equip: "Elástico", level: "Iniciante", tag: "pcd" },
    { name: "Remada Unilateral com Apoio", group: "Costas", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Elevação Lateral Sentada", group: "Ombro", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Flexão de Punho Adaptada", group: "Antebraços", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Círculos de Braço Isométricos", group: "Ombro", equip: "Peso corporal", level: "Iniciante", tag: "pcd" },
    { name: "Abertura de Peito com Elástico", group: "Peito", equip: "Elástico", level: "Iniciante", tag: "pcd" },
    { name: "Remada Alta Sentada", group: "Trapézio", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Encolhimento de Ombros Sentado", group: "Trapézio", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Soco Frontal com Pesos Leves", group: "Cardio", equip: "Halter", level: "Iniciante", tag: "pcd" },
    { name: "Natação a Seco (Braços)", group: "Costas Superiores", equip: "Peso corporal", level: "Iniciante", tag: "pcd" },
    { name: "Prancha de Mãos na Cadeira", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "pcd" },
    { name: "Inclinação Lateral de Tronco", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "pcd" },
    { name: "Rotação de Tronco Sentado", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "pcd" },
    { name: "Battle Ropes Sentado", group: "Cardio", equip: "Corda", level: "Avançado", tag: "pcd" },
    { name: "Handbike Simulada", group: "Cardio", equip: "Peso corporal", level: "Intermediário", tag: "pcd" },
    { name: "Crunch Abdominal Sentado", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "pcd" },

    // --- KNEE REHAB / LOW IMPACT (20 Exercises) ---
    { name: "Isometria de Quadríceps na Parede", group: "Quadríceps", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Elevação de Perna Estendida", group: "Quadríceps", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Ponte de Glúteo Unilateral", group: "Glúteos", equip: "Peso corporal", level: "Intermediário", tag: "knee" },
    { name: "Clamshell (Ostra)", group: "Abdutores", equip: "Elástico", level: "Iniciante", tag: "knee" },
    { name: "Deslizamento de Calcanhar", group: "Isquiotibiais", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Step-up Baixo Controlado", group: "Pernas", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Agachamento com Bola Suíça", group: "Quadríceps", equip: "Máquina", level: "Iniciante", tag: "knee" },
    { name: "Abdução de Quadril em Pé", group: "Abdutores", equip: "Cabo", level: "Iniciante", tag: "knee" },
    { name: "Extensão de Perna com Toalha", group: "Quadríceps", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Agachamento Sumô Isométrico", group: "Adutores", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Elevação de Panturrilha Sentado", group: "Panturrilha", equip: "Máquina", level: "Iniciante", tag: "knee" },
    { name: "Leg Press Amplo (Carga Leve)", group: "Pernas", equip: "Máquina", level: "Iniciante", tag: "knee" },
    { name: "Caminhada Lateral com Mini-Band", group: "Abdutores", equip: "Elástico", level: "Intermediário", tag: "knee" },
    { name: "Avanço Estático Curto", group: "Pernas", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Equilíbrio em uma Perna", group: "Corpo Inteiro", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Elevação de Pelve com Pés Elevados", group: "Glúteos", equip: "Peso corporal", level: "Intermediário", tag: "knee" },
    { name: "Mobilidade de Tornozelo", group: "Panturrilha", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Prensa de Isquiotibiais com Bola", group: "Isquiotibiais", equip: "Peso corporal", level: "Iniciante", tag: "knee" },
    { name: "Monster Walk Curto", group: "Abdutores", equip: "Elástico", level: "Intermediário", tag: "knee" },
    { name: "Flexão de Joelho em Pé (Isometria)", group: "Isquiotibiais", equip: "Peso corporal", level: "Iniciante", tag: "knee" },

    // --- SHOULDER REHAB / STABILITY (20 Exercises) ---
    { name: "Rotação Externa com Elástico", group: "Ombro", equip: "Elástico", level: "Iniciante", tag: "shoulder" },
    { name: "Rotação Interna com Elástico", group: "Ombro", equip: "Elástico", level: "Iniciante", tag: "shoulder" },
    { name: "Scaption (Elevação em Y)", group: "Ombro", equip: "Halter", level: "Iniciante", tag: "shoulder" },
    { name: "Face Pull com Foco em Escápula", group: "Costas Superiores", equip: "Cabo", level: "Iniciante", tag: "shoulder" },
    { name: "Wall Walk (Aranha na Parede)", group: "Ombro", equip: "Peso corporal", level: "Iniciante", tag: "shoulder" },
    { name: "Serratus Punch (Soco de Escápula)", group: "Ombro", equip: "Halter", level: "Iniciante", tag: "shoulder" },
    { name: "Remada Alta com Elástico", group: "Trapézio", equip: "Elástico", level: "Iniciante", tag: "shoulder" },
    { name: "Isometria de Ombro na Parede", group: "Ombro", equip: "Peso corporal", level: "Iniciante", tag: "shoulder" },
    { name: "Blackburns (Série A-Y-T)", group: "Costas Superiores", equip: "Peso corporal", level: "Intermediário", tag: "shoulder" },
    { name: "Prancha de Cotovelo com Toque no Ombro", group: "Ombro", equip: "Peso corporal", level: "Avançado", tag: "shoulder" },
    { name: "Pêndulo de Codman", group: "Ombro", equip: "Peso corporal", level: "Iniciante", tag: "shoulder" },
    { name: "Elevação Lateral com Polegar para Cima", group: "Ombro", equip: "Halter", level: "Iniciante", tag: "shoulder" },
    { name: "Retração Escapular Sentada", group: "Costas Superiores", equip: "Peso corporal", level: "Iniciante", tag: "shoulder" },
    { name: "Caminhada de Urso (Lenta)", group: "Corpo Inteiro", equip: "Peso corporal", level: "Avançado", tag: "shoulder" },
    { name: "Halo com Halter Baixo", group: "Ombro", equip: "Halter", level: "Intermediário", tag: "shoulder" },
    { name: "Estabilização com Bola na Parede", group: "Ombro", equip: "Máquina", level: "Iniciante", tag: "shoulder" },
    { name: "Prensa de Peito com Pegada Neutra", group: "Peito", equip: "Halter", level: "Iniciante", tag: "shoulder" },
    { name: "Crucifixo Inverso com Elástico", group: "Costas Superiores", equip: "Elástico", level: "Iniciante", tag: "shoulder" },
    { name: "Remada Unilateral com Apoio Inclinado", group: "Costas", equip: "Halter", level: "Iniciante", tag: "shoulder" },
    { name: "Alongamento de Peitoral na Porta", group: "Peito", equip: "Peso corporal", level: "Iniciante", tag: "shoulder" },

    // --- SPINE / CORE HEALTH (20 Exercises) ---
    { name: "Bird Dog (Cachorro-Pássaro)", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Dead Bug (Inseto Morto)", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Cat-Cow (Gato e Vaca)", group: "Pescoço", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Prancha de Joelhos Controlada", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Ponte de Glúteo (Lombar Protegida)", group: "Glúteos", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Superman (Amplitude Reduzida)", group: "Lombar", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Inclinação de Pelve", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Mobilidade Torácica Lateral", group: "Costas Superiores", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Pressão de Pallof com Elástico", group: "Abdômen", equip: "Elástico", level: "Intermediário", tag: "spine" },
    { name: "Rotação de Quadril Deitado", group: "Lombar", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Prancha Lateral de Joelhos", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Bird Dog Unilateral Repetido", group: "Abdômen", equip: "Peso corporal", level: "Intermediário", tag: "spine" },
    { name: "Alongamento Cobra (Suave)", group: "Lombar", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Flexão de Joelho ao Peito Deitado", group: "Lombar", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Thread the Needle", group: "Costas Superiores", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Abdominal Infra com Pernas Dobradas", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Isometria de Core em Pé com Peso", group: "Abdômen", equip: "Anilha", level: "Intermediário", tag: "spine" },
    { name: "Mobilidade de Quadril em 90/90", group: "Pernas", equip: "Peso corporal", level: "Iniciante", tag: "spine" },
    { name: "Prancha com Elevação de Braço", group: "Abdômen", equip: "Peso corporal", level: "Avançado", tag: "spine" },
    { name: "Child's Pose (Postura da Criança)", group: "Lombar", equip: "Peso corporal", level: "Iniciante", tag: "spine" },

    // --- GENERAL MOBILITY / ACTIVE RECOVERY (20 Exercises) ---
    { name: "Rotação de Pescoço 360", group: "Pescoço", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Círculos de Quadril no Ar", group: "Pernas", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Alongamento de Isquiotibiais com Toalha", group: "Isquiotibiais", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Rotação de Punho e Tornozelo", group: "Corpo Inteiro", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "World's Greatest Stretch", group: "Corpo Inteiro", equip: "Peso corporal", level: "Intermediário", tag: "mobility" },
    { name: "Alongamento de Quadríceps em Pé", group: "Quadríceps", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Abertura de Quadril em Coxeador", group: "Abdutores", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Mobilidade de Escápula na Parede", group: "Costas Superiores", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Alongamento de Psoas", group: "Pernas", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Deep Squat Hold (Isometria Profunda)", group: "Quadríceps", equip: "Peso corporal", level: "Intermediário", tag: "mobility" },
    { name: "Rotação de Tornozelo com Elástico", group: "Panturrilha", equip: "Elástico", level: "Iniciante", tag: "mobility" },
    { name: "Alongamento de Glúteo Sentado", group: "Glúteos", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Caminhada de Polegar (Pés)", group: "Corpo Inteiro", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Mobilidade de Ombro com Bastão", group: "Ombro", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Postura do Guerreiro (Yoga Flow)", group: "Corpo Inteiro", equip: "Peso corporal", level: "Intermediário", tag: "mobility" },
    { name: "Alongamento de Triceps com Apoio", group: "Tríceps", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Círculos de Peitoral (Braços)", group: "Peito", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Alternância de Perna (Swing)", group: "Pernas", equip: "Peso corporal", level: "Intermediário", tag: "mobility" },
    { name: "Inclinação de Tronco Estilo Moinho", group: "Abdômen", equip: "Peso corporal", level: "Iniciante", tag: "mobility" },
    { name: "Relaxamento Savasana (Finalização)", group: "Corpo Inteiro", equip: "Peso corporal", level: "Iniciante", tag: "mobility" }
  ];

  // Map to full exercise structure
  const formattedSeeds = adaptiveSeeds.map(s => {
    const visual = (window.MUSCLE_GROUP_VISUALS && window.MUSCLE_GROUP_VISUALS[s.group]) || { color: '#6b7280', abbr: '??' };
    const id = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').replace(/^-+/, '');
    
    return {
      id: id,
      name: s.name,
      primaryMuscleGroup: s.group,
      secondaryMuscles: [],
      equipment: s.equip,
      level: s.level,
      description: `${s.name} - Exercício adaptado com foco em segurança e reabilitação.`,
      gifUrl: '', // Will use local simulated GIF system if needed or generic icons
      images: [],
      muscleColor: visual.color,
      muscleAbbr: visual.abbr,
      isAdaptive: true,
      adaptiveTag: s.tag
    };
  });

  // Expose to window
  window.ADAPTIVE_SEEDS = formattedSeeds;
  
  // MERGE into main catalog if available
  if (window.SEED_EXERCISES) {
    console.log(`✅ Merging 100 Adaptive Exercises into catalog (Total: ${window.SEED_EXERCISES.length + formattedSeeds.length})`);
    window.SEED_EXERCISES = [...window.SEED_EXERCISES, ...formattedSeeds];
  }

})();

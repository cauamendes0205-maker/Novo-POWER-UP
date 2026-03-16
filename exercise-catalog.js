(function () {
  // Exercise Catalog module for PowerUp
  // Exposes window.ExerciseCatalog with functions requested by the user.

  const STATE = {
    exercises: [],
    initialized: false
  };

  // Helper: fetch exercises from Firebase or fallback to JSON
  async function loadSeed() {
    if (STATE.exercises.length) return STATE.exercises;

    // Try Firebase first (preferred for data consistency)
    if (window.Firebase && window.Firebase.db) {
      try {
        console.log('📡 Carregando exercícios do Firebase...');
        const exercisesRef = window.Firebase.collection(window.Firebase.db, 'exercise_library');
        const snapshot = await window.Firebase.getDocs(exercisesRef);

        if (!snapshot.empty) {
          const exercises = [];
          snapshot.forEach(doc => {
            exercises.push({ id: doc.id, ...doc.data() });
          });
          STATE.exercises = exercises.map(e => ({ ...e, secondaryMuscles: e.secondaryMuscles || [] }));
          console.log(`✅ ${exercises.length} exercícios carregados do Firebase`);
          return STATE.exercises;
        }
      } catch (err) {
        console.warn('⚠️ Erro ao carregar do Firebase, tentando fallback...', err);
      }
    }

    // Prefer inlined seed when available (useful for file:// and quick dev)
    if (window && window.SEED_EXERCISES && Array.isArray(window.SEED_EXERCISES) && window.SEED_EXERCISES.length) {
      STATE.exercises = window.SEED_EXERCISES.slice();
      STATE.exercises = STATE.exercises.map(e => ({ ...e, secondaryMuscles: [] }));
      return STATE.exercises;
    }

    // Fallback to JSON file
    try {
      const resp = await fetch('./exercises_full.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error('Failed to load exercises_full.json');
      const data = await resp.json();
      STATE.exercises = data;
      STATE.exercises = STATE.exercises.map(e => ({ ...e, secondaryMuscles: [] }));
      return STATE.exercises;
    } catch (err) {
      console.warn('ExerciseCatalog: could not load exercises_full.json, falling back to empty list', err);
      STATE.exercises = [];
      return STATE.exercises;
    }
  }

  function normalizeQuery(q) {
    return (q || '').toString().trim().toLowerCase();
  }

  async function init() {
    await loadSeed();
    STATE.initialized = true;
    return STATE.exercises;
  }

  function getAllExercises() {
    return STATE.exercises.slice();
  }

  function getExerciseById(id) {
    return STATE.exercises.find(e => e.id === id) || null;
  }

  function searchExercises(query) {
    const q = normalizeQuery(query);
    if (!q) return getAllExercises();
    return STATE.exercises.filter(e => e.name.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q));
  }

  function filterExercises(filters) {
    // filters: {primaryMuscleGroup, equipment, level}
    return STATE.exercises.filter(e => {
      if (!filters) return true;
      if (filters.primaryMuscleGroup && e.primaryMuscleGroup !== filters.primaryMuscleGroup) return false;
      if (filters.equipment && e.equipment !== filters.equipment) return false;
      if (filters.level && e.level !== filters.level) return false;
      return true;
    });
  }

  // Recent exercises: prefer Firestore if window.Firebase exists, otherwise localStorage fallback
  async function getRecentExercises(userId, limit = 20) {
    if (!userId) return [];
    if (window.Firebase && window.Firebase.db) {
      try {
        const q = window.Firebase.query(
          window.Firebase.collection(window.Firebase.db, 'recent_exercises'),
          window.Firebase.where('userId', '==', userId),
          window.Firebase.orderBy('lastUsedAt', 'desc'),
          window.Firebase.limit(limit)
        );
        const snap = await window.Firebase.getDocs(q);
        const results = [];
        snap.forEach(doc => results.push(doc.data()));
        return results.map(r => ({ ...r, exercise: getExerciseById(r.exerciseId) }));
      } catch (err) {
        console.warn('getRecentExercises firestore failed', err);
        return getRecentExercisesLocal(userId, limit);
      }
    } else {
      return getRecentExercisesLocal(userId, limit);
    }
  }

  function getRecentExercisesLocal(userId, limit = 20) {
    try {
      const key = `powerup_recent_${userId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      arr.sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt));
      return arr.slice(0, limit).map(r => ({ ...r, exercise: getExerciseById(r.exerciseId) }));
    } catch (err) {
      return [];
    }
  }

  async function recordExerciseUsage(userId, exerciseId) {
    const now = (new Date()).toISOString();
    if (!userId || !exerciseId) return null;
    if (window.Firebase && window.Firebase.db) {
      try {
        // Use doc id composed of userId_exerciseId to simplify upsert
        const docId = `${userId}_${exerciseId}`;
        const ref = window.Firebase.doc(window.Firebase.db, 'recent_exercises', docId);
        const payload = { userId, exerciseId, lastUsedAt: now };
        await window.Firebase.setDoc(ref, payload, { merge: true });
        // Enforce count limit per user (keep most recent N)
        // Query user's recent_exercises ordered desc and delete extras
        const q = window.Firebase.query(
          window.Firebase.collection(window.Firebase.db, 'recent_exercises'),
          window.Firebase.where('userId', '==', userId),
          window.Firebase.orderBy('lastUsedAt', 'desc')
        );
        const snap = await window.Firebase.getDocs(q);
        const docs = [];
        snap.forEach(d => docs.push({ id: d.id, data: d.data() }));
        const max = 20;
        if (docs.length > max) {
          const toDelete = docs.slice(max);
          for (const d of toDelete) {
            try { await window.Firebase.deleteDoc(window.Firebase.doc(window.Firebase.db, 'recent_exercises', d.id)); } catch (e) { }
          }
        }
        return payload;
      } catch (err) {
        console.warn('recordExerciseUsage (firestore) failed', err);
        return recordExerciseUsageLocal(userId, exerciseId, now);
      }
    } else {
      return recordExerciseUsageLocal(userId, exerciseId, now);
    }
  }

  function recordExerciseUsageLocal(userId, exerciseId, when) {
    try {
      const key = `powerup_recent_${userId}`;
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      // remove existing
      const filtered = arr.filter(r => r.exerciseId !== exerciseId);
      filtered.unshift({ userId, exerciseId, lastUsedAt: when || (new Date()).toISOString() });
      const max = 20;
      const trimmed = filtered.slice(0, max);
      localStorage.setItem(key, JSON.stringify(trimmed));
      return trimmed[0];
    } catch (err) {
      console.warn('recordExerciseUsageLocal failed', err);
      return null;
    }
  }

  // Workout integration: add an exercise reference to an existing workout doc
  // workout doc expected to have `exercises: [{ exerciseId, sets, reps, weight, restTime }]`
  async function addExerciseToWorkout(workoutId, exerciseId, opts) {
    // opts: {sets, reps, weight, restTime}
    if (!workoutId || !exerciseId) throw new Error('workoutId and exerciseId required');
    const entry = {
      exerciseId,
      sets: opts && opts.sets != null ? opts.sets : 3,
      reps: opts && opts.reps != null ? opts.reps : 10,
      weight: opts && opts.weight != null ? opts.weight : null,
      restTime: opts && opts.restTime != null ? opts.restTime : 60
    };

    if (window.Firebase && window.Firebase.db) {
      const ref = window.Firebase.doc(window.Firebase.db, 'workouts', workoutId);
      try {
        const snap = await window.Firebase.getDoc(ref);
        if (!snap.exists()) throw new Error('Workout not found');
        const data = snap.data();
        const arr = Array.isArray(data.exercises) ? data.exercises.slice() : [];
        arr.push(entry);
        await window.Firebase.updateDoc(ref, { exercises: arr });
        // record usage for user if workout has owner uid
        const uid = data.userId || (window.Firebase.auth && window.Firebase.auth.currentUser && window.Firebase.auth.currentUser.uid);
        if (uid) recordExerciseUsage(uid, exerciseId).catch(() => { });
        return { success: true, entry };
      } catch (err) {
        console.warn('addExerciseToWorkout failed (firestore)', err);
        throw err;
      }
    } else {
      // Fallback: store workouts in localStorage (for dev)
      const key = `powerup_workout_${workoutId}`;
      try {
        const raw = localStorage.getItem(key);
        const data = raw ? JSON.parse(raw) : { id: workoutId, exercises: [] };
        data.exercises = data.exercises || [];
        data.exercises.push(entry);
        localStorage.setItem(key, JSON.stringify(data));
        // can't infer userId here
        return { success: true, entry };
      } catch (err) {
        console.warn('addExerciseToWorkout local failed', err);
        throw err;
      }
    }
  }

  // Expose API
  const API = {
    init,
    getAllExercises,
    getExerciseById,
    searchExercises,
    filterExercises,
    getRecentExercises,
    recordExerciseUsage,
    addExerciseToWorkout
  };

  // Attach to window
  window.ExerciseCatalog = API;

  // Auto-init in background (non-blocking)
  loadSeed().then(() => { STATE.initialized = true; }).catch(() => { });

})();

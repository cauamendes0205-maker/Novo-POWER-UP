// Firebase Imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signInAnonymously, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuXgXopMsUUAhAOJTQuJ-3YpKVC6JpzFc",
    authDomain: "powerup-a8304.firebaseapp.com",
    projectId: "powerup-a8304",
    storageBucket: "powerup-a8304.firebasestorage.app",
    messagingSenderId: "791965493369",
    appId: "1:791965493369:web:75414f84f1976d5af74ca8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Expose Firebase globally for legacy script access
window.Firebase = {
    auth, db, signInWithEmailAndPassword, signInAnonymously, signOut,
    onAuthStateChanged, createUserWithEmailAndPassword, updateProfile,
    collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit
};

// =========================================
// Firebase Service Layer (backend-specialist pattern)
// Centralized error handling, consistent response format
// =========================================
const FirebaseService = {
    // Consistent response format for all operations
    createResponse: function (success, data = null, error = null) {
        return { success, data, error, timestamp: new Date().toISOString() };
    },

    // Centralized error handler
    handleError: function (operation, error) {
        console.error(`❌ FirebaseService.${operation}:`, error.message || error);
        return this.createResponse(false, null, error.message || 'Unknown error');
    },

    // Check if Firebase is available
    isReady: function () {
        return window.Firebase && window.Firebase.db && window.Firebase.auth;
    },

    // Get current user ID (with validation)
    getCurrentUserId: function () {
        if (!this.isReady()) return null;
        const user = window.Firebase.auth.currentUser;
        return user ? user.uid : null;
    },

    // Generic document save with validation
    saveDocument: async function (collection, docId, data) {
        if (!this.isReady()) return this.createResponse(false, null, 'Firebase not ready');
        if (!docId || typeof docId !== 'string') return this.createResponse(false, null, 'Invalid document ID');
        if (!data || typeof data !== 'object') return this.createResponse(false, null, 'Invalid data');

        try {
            const ref = window.Firebase.doc(window.Firebase.db, collection, docId);
            await window.Firebase.setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
            return this.createResponse(true, { id: docId });
        } catch (error) {
            return this.handleError('saveDocument', error);
        }
    },

    // Register user and create profile
    registerUser: async function (email, password, name, isPublic = true) {
        if (!this.isReady()) return this.createResponse(false, null, 'Firebase not ready');
        if (!email || !password || !name) return this.createResponse(false, null, 'Input validation failed');

        try {
            const userCredential = await window.Firebase.createUserWithEmailAndPassword(window.Firebase.auth, email, password);
            await window.Firebase.updateProfile(userCredential.user, { displayName: name });

            const userDoc = {
                uid: userCredential.user.uid,
                name: name,
                email: email,
                isPublic: isPublic,
                createdAt: new Date().toISOString()
            };

            await window.Firebase.setDoc(window.Firebase.doc(window.Firebase.db, 'users', userCredential.user.uid), userDoc);
            return this.createResponse(true, { user: userCredential.user });
        } catch (error) {
            return this.handleError('registerUser', error);
        }
    },

    // Login user
    loginUser: async function (email, password) {
        if (!this.isReady()) return this.createResponse(false, null, 'Firebase not ready');
        if (!email || !password) return this.createResponse(false, null, 'Username and password required');

        try {
            const userCredential = await window.Firebase.signInWithEmailAndPassword(window.Firebase.auth, email, password);
            return this.createResponse(true, { user: userCredential.user });
        } catch (error) {
            return this.handleError('loginUser', error);
        }
    },

    // Generic document fetch with validation
    getDocument: async function (collection, docId) {
        if (!this.isReady()) return this.createResponse(false, null, 'Firebase not ready');
        if (!docId || typeof docId !== 'string') return this.createResponse(false, null, 'Invalid document ID');

        try {
            const ref = window.Firebase.doc(window.Firebase.db, collection, docId);
            const doc = await window.Firebase.getDoc(ref);
            if (doc.exists()) {
                return this.createResponse(true, { id: doc.id, ...doc.data() });
            }
            return this.createResponse(false, null, 'Document not found');
        } catch (error) {
            return this.handleError('getDocument', error);
        }
    },

    // Save user profile data
    saveUserProfile: async function (data) {
        const userId = this.getCurrentUserId();
        if (!userId) return this.createResponse(false, null, 'User not authenticated');
        return await this.saveDocument('users', userId, data);
    },

    // Get user profile data
    getUserProfile: async function () {
        const userId = this.getCurrentUserId();
        if (!userId) return this.createResponse(false, null, 'User not authenticated');
        return await this.getDocument('users', userId);
    },

    // Add to subcollection (workouts, etc)
    addToSubcollection: async function (subcollection, data) {
        const userId = this.getCurrentUserId();
        if (!userId) return this.createResponse(false, null, 'User not authenticated');
        if (!data || typeof data !== 'object') return this.createResponse(false, null, 'Invalid data');

        try {
            const collRef = window.Firebase.collection(window.Firebase.db, 'users', userId, subcollection);
            const docRef = await window.Firebase.addDoc(collRef, {
                ...data,
                userId,
                createdAt: new Date().toISOString()
            });
            return this.createResponse(true, { id: docRef.id });
        } catch (error) {
            return this.handleError('addToSubcollection', error);
        }
    },

    // Query subcollection with options
    querySubcollection: async function (subcollection, options = {}) {
        const userId = this.getCurrentUserId();
        if (!userId) return this.createResponse(false, null, 'User not authenticated');

        try {
            const collRef = window.Firebase.collection(window.Firebase.db, 'users', userId, subcollection);
            let q = collRef;

            if (options.orderBy) {
                q = window.Firebase.query(q, window.Firebase.orderBy(options.orderBy, options.order || 'desc'));
            }
            if (options.limit) {
                q = window.Firebase.query(q, window.Firebase.limit(options.limit));
            }

            const snapshot = await window.Firebase.getDocs(q);
            const results = [];
            snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            return this.createResponse(true, results);
        } catch (error) {
            return this.handleError('querySubcollection', error);
        }
    },

    // Delete document from collection
    deleteDocument: async function (collection, docId) {
        if (!this.isReady()) return this.createResponse(false, null, 'Firebase not ready');
        if (!docId || typeof docId !== 'string') return this.createResponse(false, null, 'Invalid document ID');

        try {
            const ref = window.Firebase.doc(window.Firebase.db, collection, docId);
            await window.Firebase.deleteDoc(ref);
            return this.createResponse(true, { deleted: docId });
        } catch (error) {
            return this.handleError('deleteDocument', error);
        }
    },

    // Get user workout statistics
    getUserStats: async function () {
        const workoutsResult = await this.querySubcollection('workouts', { orderBy: 'date', order: 'desc', limit: 100 });
        if (!workoutsResult.success) return workoutsResult;

        const workouts = workoutsResult.data;
        const now = new Date();
        const thisWeek = workouts.filter(w => {
            const d = new Date(w.date || w.createdAt);
            return (now - d) / (1000 * 60 * 60 * 24) <= 7;
        });
        const thisMonth = workouts.filter(w => {
            const d = new Date(w.date || w.createdAt);
            return (now - d) / (1000 * 60 * 60 * 24) <= 30;
        });

        return this.createResponse(true, {
            totalWorkouts: workouts.length,
            thisWeek: thisWeek.length,
            thisMonth: thisMonth.length,
            streak: this.calculateStreak(workouts),
            lastWorkout: workouts[0] || null
        });
    },

    // Calculate consecutive days streak
    calculateStreak: function (workouts) {
        if (!workouts || workouts.length === 0) return 0;

        const sortedDates = workouts
            .map(w => new Date(w.date || w.createdAt).toDateString())
            .filter((v, i, a) => a.indexOf(v) === i) // unique dates
            .sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Check if last workout was today or yesterday
        if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

        for (let i = 0; i < sortedDates.length; i++) {
            const expected = new Date(Date.now() - (i * 86400000)).toDateString();
            if (sortedDates[i] === expected || (i === 0 && sortedDates[i] === yesterday)) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    },

    // Sync all user data (comprehensive save)
    syncUserData: async function (userData) {
        if (!userData || typeof userData !== 'object') {
            return this.createResponse(false, null, 'Invalid user data');
        }

        const result = await this.saveUserProfile({
            currentWeight: userData.currentWeight,
            targetWeight: userData.targetWeight,
            startWeight: userData.startWeight,
            limitations: userData.limitations,
            adaptiveProfile: userData.adaptiveProfile
        });

        return result;
    },

    // Get prebuilt workout templates by goal
    getPrebuiltWorkouts: async function (goal = null) {
        if (!this.isReady()) return this.createResponse(false, null, 'Firebase not ready');

        try {
            const workoutsRef = window.Firebase.collection(window.Firebase.db, 'prebuilt_workouts');
            let q = workoutsRef;

            if (goal) {
                q = window.Firebase.query(workoutsRef, window.Firebase.where('goal', '==', goal));
            }

            const snapshot = await window.Firebase.getDocs(q);
            const workouts = [];
            snapshot.forEach(doc => workouts.push({ id: doc.id, ...doc.data() }));

            console.log(`📋 ${workouts.length} treinos pré-feitos carregados`);
            return this.createResponse(true, workouts);
        } catch (error) {
            return this.handleError('getPrebuiltWorkouts', error);
        }
    },

    // Copy prebuilt workout to user's workouts
    copyWorkoutToUser: async function (prebuiltWorkout) {
        if (!prebuiltWorkout || typeof prebuiltWorkout !== 'object') {
            return this.createResponse(false, null, 'Invalid workout data');
        }

        const userWorkout = {
            name: prebuiltWorkout.name,
            description: prebuiltWorkout.description,
            goal: prebuiltWorkout.goal,
            difficulty: prebuiltWorkout.difficulty,
            durationMinutes: prebuiltWorkout.durationMinutes,
            exercises: prebuiltWorkout.exercises || [],
            isFromPrebuilt: true,
            originalId: prebuiltWorkout.id
        };

        return await this.addToSubcollection('workouts', userWorkout);
    }
};

// Expose FirebaseService globally
window.FirebaseService = FirebaseService;

// =========================================
// Community Service Layer (backend-specialist pattern)
// Denormalized Firestore schema: posts embed likes[] and comments[]
// Timestamps: createdAt, updatedAt on all documents
// =========================================
const CommunityService = {
    // Local feed cache (denormalized — always fetched together)
    posts: [
        {
            id: 'mock-post-1',
            authorId: 'sarah-fit-001',
            authorName: 'Sarah Fit',
            authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Fit&background=e16716&color=fff&bold=true',
            text: 'Hoje foi dia de bater PR no agachamento! 120kg 💪 Nunca desista dos seus objetivos.',
            imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
            workoutStats: { calories: 450, duration: '52 min', hasPR: true },
            type: 'post',
            likes: ['user-001', 'user-002', 'user-003'],
            comments: [
                { id: 'c1', authorName: 'Pedro M.', text: 'Que monstro! 🔥', createdAt: new Date(Date.now() - 3600000).toISOString() },
                { id: 'c2', authorName: 'Maria L.', text: 'Parabéns pelo PR!', createdAt: new Date(Date.now() - 1800000).toISOString() }
            ],
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isOnline: true
        },
        {
            id: 'mock-post-2',
            authorId: 'joao-treino-001',
            authorName: 'João Treino',
            authorAvatar: 'https://ui-avatars.com/api/?name=João+T&background=1a1a1a&color=fff&bold=true',
            text: 'Corrida matinal de 5km para começar bem o dia! 🏃‍♂️💨',
            imageUrl: null,
            workoutStats: { calories: 320, duration: '28:15 min', distance: '5.2 km', name: 'Corrida Matinal' },
            type: 'post',
            likes: ['user-001'],
            comments: [],
            createdAt: new Date(Date.now() - 18000000).toISOString(),
            isOnline: false
        },
        {
            id: 'mock-post-3',
            authorId: 'ana-r-001',
            authorName: 'Ana Rodrigues',
            authorAvatar: 'https://ui-avatars.com/api/?name=Ana+R&background=22c55e&color=fff&bold=true',
            text: '30 dias seguidos de treino! Nunca pensei que ia conseguir, mas aqui estou! 🎉🔥',
            imageUrl: null,
            workoutStats: null,
            type: 'achievement',
            achievementData: { title: '30 Dias Seguidos', subtitle: 'Streak perfeito atingido!' },
            likes: ['user-001', 'user-002', 'user-003', 'user-004', 'user-005'],
            comments: [
                { id: 'c3', authorName: 'Carlos V.', text: 'Inspiração pura! 💪', createdAt: new Date(Date.now() - 25000000).toISOString() }
            ],
            createdAt: new Date(Date.now() - 28800000).toISOString(),
            isOnline: false
        }
    ],

    // Get current user ID for like checks
    _getCurrentUserId: function () {
        if (typeof AppState !== 'undefined' && AppState.currentUser) {
            return AppState.currentUser.uid;
        }
        return 'local-user';
    },

    // Load feed — try Firestore, fallback to local mock
    loadFeed: async function () {
        if (window.Firebase && window.Firebase.db) {
            try {
                const postsRef = window.Firebase.collection(window.Firebase.db, 'community_posts');
                const q = window.Firebase.query(postsRef, window.Firebase.orderBy('createdAt', 'desc'));
                const snapshot = await window.Firebase.getDocs(q);
                if (snapshot.size > 0) {
                    this.posts = [];
                    snapshot.forEach(doc => this.posts.push({ id: doc.id, ...doc.data() }));
                    console.log(`📱 ${this.posts.length} posts carregados do Firestore`);
                    return this.posts;
                }
            } catch (e) {
                console.warn('⚠️ Firestore unavailable for community, using local data:', e.message);
            }
        }
        console.log('📱 Usando dados mock da comunidade');
        return this.posts;
    },

    // Create a new post
    createPost: async function (data) {
        const userId = this._getCurrentUserId();
        const userName = (typeof AppState !== 'undefined' && AppState.profile) ? AppState.profile.name : 'Utilizador';

        const newPost = {
            id: 'post-' + Date.now(),
            authorId: userId,
            authorName: userName,
            authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=e16716&color=fff&bold=true`,
            text: data.text || '',
            imageUrl: data.imageUrl || null,
            workoutStats: data.workoutStats || null,
            type: data.type || 'post',
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
            isOnline: true
        };

        // Try save to Firestore
        if (window.Firebase && window.Firebase.db) {
            try {
                const postsRef = window.Firebase.collection(window.Firebase.db, 'community_posts');
                const docRef = await window.Firebase.addDoc(postsRef, newPost);
                newPost.id = docRef.id;
                console.log('✅ Post salvo no Firestore:', docRef.id);
            } catch (e) {
                console.warn('⚠️ Erro ao salvar post no Firestore:', e.message);
            }
        }

        // Prepend to local feed
        this.posts.unshift(newPost);
        return newPost;
    },

    // Toggle like on a post
    toggleLike: function (postId) {
        const userId = this._getCurrentUserId();
        const post = this.posts.find(p => p.id === postId);
        if (!post) return false;

        const idx = post.likes.indexOf(userId);
        if (idx === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(idx, 1);
        }

        // Async Firestore sync (fire-and-forget)
        if (window.Firebase && window.Firebase.db && !postId.startsWith('mock-')) {
            try {
                const postRef = window.Firebase.doc(window.Firebase.db, 'community_posts', postId);
                window.Firebase.updateDoc(postRef, { likes: post.likes });
            } catch (e) { /* silent */ }
        }

        return idx === -1; // true = liked, false = unliked
    },

    // Check if current user liked a post
    isLiked: function (postId) {
        const userId = this._getCurrentUserId();
        const post = this.posts.find(p => p.id === postId);
        return post ? post.likes.includes(userId) : false;
    },

    // Add comment to a post
    addComment: function (postId, text) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !text.trim()) return null;

        const userName = (typeof AppState !== 'undefined' && AppState.profile) ? AppState.profile.name : 'Utilizador';
        const comment = {
            id: 'comment-' + Date.now(),
            authorName: userName,
            text: text.trim(),
            createdAt: new Date().toISOString()
        };

        post.comments.push(comment);

        // Async Firestore sync
        if (window.Firebase && window.Firebase.db && !postId.startsWith('mock-')) {
            try {
                const postRef = window.Firebase.doc(window.Firebase.db, 'community_posts', postId);
                window.Firebase.updateDoc(postRef, { comments: post.comments });
            } catch (e) { /* silent */ }
        }

        return comment;
    },

    // Format relative time
    _timeAgo: function (isoDate) {
        const diff = Date.now() - new Date(isoDate).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Agora';
        if (mins < 60) return `Há ${mins} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Há ${hours}h`;
        const days = Math.floor(hours / 24);
        return `Há ${days}d`;
    }
};

// Expose globally
window.CommunityService = CommunityService;

// =========================================
// Professional Service (Backend For Marketplace)
// Handles trainers logic, discovery, and subscriptions
// =========================================
const ProfessionalService = {
    // Mock Data for Phase 1 MVP
    mockProfessionals: [
        {
            id: 'prof-001',
            name: 'Carlos Oliveira',
            bio: 'Especialista em hipertrofia e emagrecimento com mais de 10 anos transformando físicos. Meu foco é na biomecânica perfeita para resultados máximos sem lesões.',
            photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specialties: ['Hipertrofia', 'Emagrecimento', 'Força'],
            rating: 4.9,
            reviewCount: 142,
            availableOnline: true,
            certifications: [
                { name: 'Mestrado em Biomecânica', issuer: 'USP' },
                { name: 'Strength Coach L2', issuer: 'IFBB' }
            ],
            plans: [
                { id: 'plan-001A', title: 'Consultoria Básica', priceMonthly: 150.00, description: 'Treino mensal personalizado entregue via app.' },
                { id: 'plan-001B', title: 'Acompanhamento Premium', priceMonthly: 300.00, description: 'Treino, análise de vídeos semanais e chat 24/7.' }
            ]
        },
        {
            id: 'prof-002',
            name: 'Ana Souza',
            bio: 'Treinadora focada em saúde feminina, mobilidade e reabilitação. Ajudo você a recuperar a confiança e força do seu corpo em qualquer idade.',
            photoUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specialties: ['Saúde Feminina', 'Mobilidade', 'Reabilitação'],
            rating: 4.8,
            reviewCount: 89,
            availableOnline: true,
            certifications: [
                { name: 'Reabilitação Pós-Lesão', issuer: 'Fisioterapia.Org' }
            ],
            plans: [
                { id: 'plan-002A', title: 'Plano Saúde Integral', priceMonthly: 200.00, description: 'Foco em mobilidade e força para o dia a dia.' }
            ]
        },
        {
            id: 'prof-003',
            name: 'Marcos "The Rock" Lima',
            bio: 'Alta intensidade e performance atlética. Se você busca preparação física para esportes ou superar seus limites, meu time é para você.',
            photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specialties: ['Alta Performance', 'Força', 'Cross-Training'],
            rating: 5.0,
            reviewCount: 315,
            availableOnline: true,
            certifications: [
                { name: 'CrossFit L3', issuer: 'CrossFit HQ' },
                { name: 'Nutrição Esportiva', issuer: 'Unicamp' }
            ],
            plans: [
                { id: 'plan-003A', title: 'Atleta Pro', priceMonthly: 250.00, description: 'Preparação física intensa e periodizada.' }
            ]
        }
    ],

    _getCurrentUserId: function () {
        if (window.Firebase && window.Firebase.auth && window.Firebase.auth.currentUser) {
            return window.Firebase.auth.currentUser.uid;
        }
        return 'mock-user-id'; // Fallback for dev
    },

    // [GET] /api/v1/trainers (List)
    getMarketplaceProfessionals: async function () {
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, data: this.mockProfessionals }), 300); // Simulate network latency
        });
    },

    // [POST] /api/v1/trainers/search (Search/Filter)
    filterProfessionals: async function (queryStr = '', specialtyFilter = '') {
        const results = this.mockProfessionals.filter(p => {
            const matchName = p.name.toLowerCase().includes(queryStr.toLowerCase());
            const matchSpecialty = specialtyFilter === '' || p.specialties.includes(specialtyFilter);
            return matchName && matchSpecialty;
        });
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true, data: results }), 200);
        });
    },

    // [GET] /api/v1/trainers/{id} (Profile)
    getTrainerProfile: async function (trainerId) {
        const profile = this.mockProfessionals.find(p => p.id === trainerId);
        return new Promise(resolve => {
            setTimeout(() => {
                if (profile) resolve({ success: true, data: profile });
                else resolve({ success: false, error: 'Trainer not found' });
            }, 200);
        });
    },

    // [POST] /api/v1/subscriptions (Hire/Contract)
    createSubscription: async function (trainerId, planId) {
        const userId = this._getCurrentUserId();
        console.log(`[Backend API] User ${userId} subscribing to plan ${planId} of trainer ${trainerId}`);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, data: { subscription_id: 'sub-' + Date.now(), status: 'active' } });
            }, 800);
        });
    }
};

window.ProfessionalService = ProfessionalService;

// Mock API & Backend Logic
const MockAPI = {
    userData: {
        currentWeight: 75,
        startWeight: 75,
        targetWeight: 90,
        limitations: ['knee_pain'], // ex: 'knee_pain', 'shoulder_pain'
        workoutLogs: [
            { muscle: 'Pernas', sets: 4, reps: 10, load: 100 }, // 4000 volume
            { muscle: 'Ombros', sets: 3, reps: 12, load: 15 }   // 540 volume
        ],
        adaptiveProfile: {
            onboardingComplete: false,
            needs: []
        },
        favorites: [],
        settings: {
            notifications: true,
            theme: 'light',
            language: 'pt',
            units: 'kg',
            reminderTime: '08:00',
            soundEnabled: true
        }
    },

    getData: function () {
        return this.userData;
    },

    // ... previous logic ...

    toggleVoiceCommand: function () {
        alert("Comando de Voz Ativado. Diga 'Iniciar Treino'.");
    },

    saveAdaptivePreferences: async function () {
        const form = document.getElementById('adaptive-onboarding-form');
        const checkboxes = form.querySelectorAll('input[name="adaptive-needs"]:checked');
        const needs = Array.from(checkboxes).map(cb => cb.value);

        this.userData.adaptiveProfile.needs = needs;
        this.userData.adaptiveProfile.onboardingComplete = true;

        // Save to Firebase if user is logged in
        if (typeof AppState !== 'undefined' && AppState.currentUser && window.Firebase && window.Firebase.db) {
            try {
                const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
                await window.Firebase.updateDoc(userRef, {
                    adaptiveProfile: {
                        needs: needs,
                        onboardingComplete: true,
                        updatedAt: new Date().toISOString()
                    }
                });
                console.log('✅ Perfil adaptativo salvo no Firebase');
            } catch (error) {
                console.error('❌ Erro ao salvar perfil adaptativo:', error);
            }
        }

        alert('Perfil Adaptativo Salvo com Sucesso!');
        closeModal();

        // If Rehab selected, confirm pain scale feature
        if (needs.includes('rehab')) {
            alert('Modo Reabilitação Ativado: A Escala de Dor será solicitada após cada exercício.');
        }
    },

    submitPainScale: async function () {
        const val = parseInt(document.getElementById('pain-range').value);
        closeModal();

        // Save pain log to Firebase
        await this.savePainLog(window.currentExerciseId || 'exercise', val);

        if (val >= 6) {
            setTimeout(() => {
                alert("⚠️ ALERTA DE DOR ELEVADA (" + val + "/10)\n\nRecomendação: Interromper o exercício imediatamente e aplicar gelo. A carga do próximo treino foi reduzida em 50%.");
            }, 500);
        } else {
            setTimeout(() => {
                alert("✅ Registro Salvo. Bom trabalho! Carga mantida.");
            }, 500);
        }
    },

    filterAdaptiveContent: function (category) {
        const names = {
            'injury': 'Treinos para Lesões',
            'home': 'Treino em Casa',
            'rehab': 'Reabilitação',
            'pcd': 'Adaptação PcD',
            'mobility': 'Mobilidade',
            'low_impact': 'Baixo Impacto'
        };

        const title = names[category] || 'Zona Adaptativa';

        // Get exercises
        const suggestions = this.getAdaptiveExercises(category);

        // Update Modal Content
        const list = document.getElementById('modal-suggestions');
        if (list) {
            if (suggestions.length > 0) {
                list.innerHTML = suggestions.map(item => `
                            <div class="flex items-center p-2 border border-gray-100 rounded-lg">
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <i data-lucide="check" class="w-4 h-4 text-green-600"></i>
                                </div>
                                <div>
                                    <div class="font-bold text-sm">${item.name}</div>
                                    <div class="text-xs text-green-600">${item.type}</div>
                                </div>
                            </div>
                        `).join('');
            } else {
                list.innerHTML = `<div class="p-4 text-center text-gray-500 text-sm">Nenhum exercício encontrado para esta categoria.</div>`;
            }
        }

        // Update Title logic in modal (hacky but works since we reuse the modal)
        // We will manually inject the title update into openModal or just do it here if possible.
        // Since openModal('adaptive') resets content, we need to modify openModal or call it first then update.

        openModal('adaptive');

        // Update title specifically after opening
        const modalTitle = document.querySelector('#modal-adaptive h3');
        if (modalTitle) modalTitle.textContent = title.toUpperCase();

        // Update limitation text to be generic or related to category
        const limText = document.getElementById('modal-limitation');
        if (limText) limText.textContent = "Filtro Ativo: " + title;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    calculateProgress: function () {
        const { currentWeight, targetWeight, startWeight } = this.userData;

        // Calculate progress relative to start weight
        let rawPct = 0;
        if (targetWeight !== startWeight) {
            rawPct = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;
        }

        // Clamp between 0 and 100
        rawPct = Math.max(0, Math.min(100, rawPct));

        const remaining = Math.abs(targetWeight - currentWeight).toFixed(1);

        return {
            text: `${currentWeight} \u2192 ${targetWeight} kg`,
            percentage: Math.round(rawPct) + "%",
            rawPct: rawPct,
            remaining: remaining
        };
    },

    calculateVolume: function () {
        // Mock volume calculation from logs
        return 5040; // Sum of logs
    },

    getBreakdown: function () {
        return [
            { name: 'Pernas', pct: '80%' },
            { name: 'Ombros', pct: '20%' }
        ];
    },

    getSuggestions: function (category) {
        // Se uma categoria foi passada, filtrar por ela
        if (category) {
            return this.getAdaptiveExercises(category);
        }

        // Fallback para sugestões baseadas em limitações (comportamento original)
        if (this.userData.limitations.includes('knee_pain')) {
            return [
                { name: 'Extensora Unilateral', type: 'Baixo Impacto' },
                { name: 'Agachamento Isométrico', type: 'Segurança' },
                { name: 'Elevação Pélvica', type: 'Fortalecimento' }
            ];
        }
        return [];
    },

    getAdaptiveExercises: function (category) {
        // Ensure SEED_EXERCISES is available
        const allExercises = window.SEED_EXERCISES || [];
        if (allExercises.length === 0) return [];

        let filtered = [];
        switch (category) {
            case 'injury': // Treinos de Lesão -> Low intensity, Bodyweight
                filtered = allExercises.filter(e => e.level === 'Iniciante' && (e.equipment === 'Peso corporal' || e.equipment === 'Elástico'));
                break;
            case 'home': // Treino em Casa -> Bodyweight
                filtered = allExercises.filter(e => e.equipment === 'Peso corporal');
                break;
            case 'rehab': // Reabilitação -> Beginner, very basic
                filtered = allExercises.filter(e => e.level === 'Iniciante');
                break;
            case 'pcd': // Adaptação PcD -> Upper body only
                const legMuscles = ['Quadríceps', 'Pernas', 'Panturrilha', 'Glúteos', 'Isquiotibiais', 'Adutores', 'Abdutores'];
                filtered = allExercises.filter(e => !legMuscles.includes(e.primaryMuscleGroup));
                break;
            case 'mobility': // Mobilidade -> Neck, Stretching (approximated by 'Iniciante' + certain groups)
                filtered = allExercises.filter(e => ['Pescoço', 'Ombro', 'Costas', 'Peito'].includes(e.primaryMuscleGroup) && e.level === 'Iniciante');
                break;
            case 'low_impact': // Baixo Impacto -> No jumping (approx by equipment)
                filtered = allExercises.filter(e => e.equipment === 'Peso corporal' || e.equipment === 'Máquina');
                break;
            default:
                filtered = allExercises;
        }

        // Return random 5 to simulate variety
        return filtered.sort(() => 0.5 - Math.random()).slice(0, 5).map(e => ({
            name: e.name,
            type: e.primaryMuscleGroup
        }));
    },

    updateWeight: async function () {
        const input = document.getElementById('update-weight-input');
        if (input && input.value && AppState.currentUser) {
            const newWeight = parseFloat(input.value);
            this.userData.currentWeight = newWeight;

            // Save to Firestore
            try {
                const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
                const userDoc = await window.Firebase.getDoc(userRef);
                const userData = userDoc.exists() ? userDoc.data() : {};

                // If startWeight is not set, set it to current weight (first-time setup)
                const updates = { currentWeight: newWeight };
                if (!userData.startWeight) {
                    updates.startWeight = newWeight;
                    this.userData.startWeight = newWeight;
                }

                await window.Firebase.updateDoc(userRef, updates);
                alert('Peso atualizado com sucesso!');
            } catch (error) {
                console.error('Erro ao salvar peso:', error);
                alert('Erro ao salvar peso. Tente novamente.');
            }

            updateQuickPanel();
            closeModal();
        } else if (!AppState.currentUser) {
            alert('Você precisa estar logado para atualizar o peso.');
        }
    },

    updateTargetWeight: async function () {
        const input = document.getElementById('update-target-weight-input');
        if (input && input.value && AppState.currentUser) {
            const newTarget = parseFloat(input.value);
            this.userData.targetWeight = newTarget;

            // Save to Firestore
            try {
                const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
                await window.Firebase.updateDoc(userRef, { targetWeight: newTarget });
                alert('Meta de peso atualizada com sucesso!');
            } catch (error) {
                console.error('Erro ao salvar meta:', error);
                alert('Erro ao salvar meta. Tente novamente.');
            }

            updateQuickPanel();
            closeModal();
        } else if (!AppState.currentUser) {
            alert('Você precisa estar logado para atualizar a meta.');
        }
    },

    // Save workout log to Firebase
    saveWorkoutLog: async function (workoutData) {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            console.warn('Cannot save workout: user not logged in or Firebase not available');
            return null;
        }

        const logEntry = {
            ...workoutData,
            userId: AppState.currentUser.uid,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        try {
            // Add to workouts collection (Single Source of Truth)
            const workoutsRef = window.Firebase.collection(window.Firebase.db, 'users', AppState.currentUser.uid, 'workouts');
            const docRef = await window.Firebase.addDoc(workoutsRef, logEntry);
            console.log('✅ Workout salvo no Firebase:', docRef.id);

            // Optimistic Update: Add to local state immediately
            const newLog = { id: docRef.id, ...logEntry };

            // Update Service State
            this.userData.workoutLogs.unshift(newLog);

            // Update Global AppState
            if (AppState.workoutHistory) {
                AppState.workoutHistory.unshift(newLog);
            } else {
                AppState.workoutHistory = [newLog];
            }

            // Trigger UI updates immediately
            if (typeof updateDashboardStats === 'function') updateDashboardStats();
            if (typeof loadTodaySummary === 'function') loadTodaySummary();

            return docRef.id;
        } catch (error) {
            console.error('❌ Erro ao salvar workout:', error);
            return null;
        }
    },

    // Load workout logs from Firebase
    loadWorkoutLogs: async function () {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return this.userData.workoutLogs;
        }

        try {
            const workoutsRef = window.Firebase.collection(window.Firebase.db, 'users', AppState.currentUser.uid, 'workouts');
            const q = window.Firebase.query(workoutsRef, window.Firebase.orderBy('date', 'desc'), window.Firebase.limit(50));
            const snapshot = await window.Firebase.getDocs(q);

            const logs = [];
            snapshot.forEach(doc => {
                logs.push({ id: doc.id, ...doc.data() });
            });

            console.log(`✅ ${logs.length} workouts carregados do Firebase`);
            this.userData.workoutLogs = logs;
            return logs;
        } catch (error) {
            console.error('❌ Erro ao carregar workouts:', error);
            return this.userData.workoutLogs;
        }
    },

    // Save limitations to Firebase (following backend-specialist: validate input, centralized error handling)
    saveLimitations: async function (limitations) {
        // Input validation
        if (!Array.isArray(limitations)) {
            console.error('❌ saveLimitations: limitations must be an array');
            return false;
        }

        // Sanitize input - only allow valid limitation strings
        const validLimitations = ['knee_pain', 'shoulder_pain', 'back_pain', 'wrist_pain', 'ankle_pain', 'hip_pain', 'neck_pain', 'reduced_mobility', 'visual_impairment', 'hearing_impairment'];
        const sanitizedLimitations = limitations.filter(l => validLimitations.includes(l));

        this.userData.limitations = sanitizedLimitations;

        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            console.warn('Cannot save limitations: user not logged in or Firebase not available');
            return false;
        }

        try {
            const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
            await window.Firebase.updateDoc(userRef, {
                limitations: sanitizedLimitations,
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Limitações salvas no Firebase:', sanitizedLimitations);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar limitações:', error);
            return false;
        }
    },

    // Complete workout and save to Firebase (following backend-specialist: business logic separation)
    completeWorkout: async function (workoutData) {
        // Input validation
        if (!workoutData || typeof workoutData !== 'object') {
            console.error('❌ completeWorkout: invalid workout data');
            return null;
        }

        // Calculate duration if timer was running
        let durationMinutes = workoutData.durationMinutes;
        if (!durationMinutes && AppState.workoutTimerStart) {
            const elapsedMs = Date.now() - AppState.workoutTimerStart;
            durationMinutes = Math.round(elapsedMs / 60000);
        }

        const result = await this.saveWorkoutLog({
            ...workoutData,
            durationMinutes: durationMinutes || 0,
            completedAt: new Date().toISOString(),
            status: 'completed'
        });

        if (result) {
            console.log('🎉 Treino completado e salvo com sucesso!');

            // 🏆 PR DETECTION - Check each exercise for new personal records
            if (workoutData.exercises && Array.isArray(workoutData.exercises)) {
                const detectedPRs = [];

                for (const exercise of workoutData.exercises) {
                    // Handle both 'series' (custom workouts) and 'sets' (prebuilt workouts) formats
                    const seriesArray = exercise.series || exercise.sets || [];

                    if (Array.isArray(seriesArray)) {
                        for (const series of seriesArray) {
                            // Parse reps (could be "10-12" or just a number)
                            let reps = series.reps;
                            if (typeof reps === 'string') {
                                // Take the first number from range like "10-12"
                                reps = parseInt(reps.split('-')[0], 10);
                            }

                            const weight = parseFloat(series.weight) || 0;

                            // Only check for PR if we have valid weight and reps
                            if (weight > 0 && reps > 0) {
                                try {
                                    const prResult = await this.checkForPersonalRecord(
                                        exercise.exerciseId || exercise.id,
                                        exercise.name || exercise.exerciseName,
                                        weight,
                                        reps
                                    );

                                    if (prResult && prResult.isNewPR) {
                                        detectedPRs.push(prResult.data);
                                        console.log('🏆 Novo PR detectado:', prResult.data);
                                    }
                                } catch (prError) {
                                    console.warn('⚠️ Erro ao verificar PR:', prError);
                                }
                            }
                        }
                    }
                }

                // Show celebration modal for the first PR (or best one)
                if (detectedPRs.length > 0) {
                    // Sort by 1RM to show the best PR first
                    detectedPRs.sort((a, b) => b.oneRM - a.oneRM);

                    // Show celebration after a short delay for better UX
                    setTimeout(() => {
                        showPRCelebration(detectedPRs[0]);
                    }, 500);
                }
            }
        }

        return result;
    },

    // Save pain log (for rehabilitation mode) - backend-specialist: input validation
    savePainLog: async function (exerciseId, painLevel, notes = '') {
        // Input validation
        if (typeof painLevel !== 'number' || painLevel < 0 || painLevel > 10) {
            console.error('❌ savePainLog: painLevel must be 0-10');
            return null;
        }

        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            console.warn('Cannot save pain log: user not logged in');
            return null;
        }

        const painEntry = {
            exerciseId: exerciseId || 'unknown',
            painLevel: painLevel,
            notes: typeof notes === 'string' ? notes.substring(0, 500) : '', // Limit notes length
            userId: AppState.currentUser.uid,
            createdAt: new Date().toISOString()
        };

        try {
            const painLogsRef = window.Firebase.collection(window.Firebase.db, 'users', AppState.currentUser.uid, 'painLogs');
            const docRef = await window.Firebase.addDoc(painLogsRef, painEntry);
            console.log('✅ Pain log salvo:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Erro ao salvar pain log:', error);
            return null;
        }
    },

    // Save favorite exercise
    saveFavoriteExercise: async function (exerciseId) {
        if (!exerciseId || typeof exerciseId !== 'string') {
            console.error('❌ saveFavoriteExercise: invalid exerciseId');
            return false;
        }

        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return false;
        }

        try {
            const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
            const userDoc = await window.Firebase.getDoc(userRef);
            const favorites = userDoc.exists() && userDoc.data().favorites ? userDoc.data().favorites : [];

            if (!favorites.includes(exerciseId)) {
                favorites.push(exerciseId);
                await window.Firebase.updateDoc(userRef, { favorites });
                console.log('✅ Exercício favoritado:', exerciseId);
            }
            return true;
        } catch (error) {
            console.error('❌ Erro ao favoritar:', error);
            return false;
        }
    },

    // Remove favorite exercise
    removeFavoriteExercise: async function (exerciseId) {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return false;
        }

        try {
            const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
            const userDoc = await window.Firebase.getDoc(userRef);
            let favorites = userDoc.exists() && userDoc.data().favorites ? userDoc.data().favorites : [];

            favorites = favorites.filter(id => id !== exerciseId);
            await window.Firebase.updateDoc(userRef, { favorites });
            console.log('✅ Favorito removido:', exerciseId);
            return true;
        } catch (error) {
            console.error('❌ Erro ao remover favorito:', error);
            return false;
        }
    },

    // Load favorites
    loadFavorites: async function () {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return [];
        }

        try {
            const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
            const userDoc = await window.Firebase.getDoc(userRef);
            return userDoc.exists() && userDoc.data().favorites ? userDoc.data().favorites : [];
        } catch (error) {
            console.error('❌ Erro ao carregar favoritos:', error);
            return [];
        }
    },

    // Save user settings (notifications, theme, language etc)
    saveUserSettings: async function (settings) {
        if (!settings || typeof settings !== 'object') {
            console.error('❌ saveUserSettings: invalid settings');
            return false;
        }

        // Whitelist valid settings
        const validKeys = ['notifications', 'theme', 'language', 'units', 'reminderTime', 'soundEnabled'];
        const sanitizedSettings = {};
        for (const key of validKeys) {
            if (settings.hasOwnProperty(key)) {
                sanitizedSettings[key] = settings[key];
            }
        }

        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return false;
        }

        try {
            const userRef = window.Firebase.doc(window.Firebase.db, 'users', AppState.currentUser.uid);
            await window.Firebase.updateDoc(userRef, {
                settings: sanitizedSettings,
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Configurações salvas:', sanitizedSettings);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar configurações:', error);
            return false;
        }
    },

    // ========================================
    // 🏆 PERSONAL RECORDS (PR) SYSTEM
    // ========================================

    // Calculate 1RM using Brzycki formula: 1RM = w * (1 + r/30)
    calculate1RM: function (weight, reps) {
        if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
        // Brzycki formula: 1RM = w * (1 + r/30)
        return Math.round(weight * (1 + reps / 30) * 10) / 10;
    },

    // Check if current performance is a new PR
    checkForPersonalRecord: async function (exerciseId, exerciseName, weight, reps) {
        if (!exerciseId || !weight || !reps) {
            return { isNewPR: false };
        }

        const current1RM = this.calculate1RM(weight, reps);
        if (current1RM <= 0) return { isNewPR: false };

        // Get existing PR for this exercise
        const existingPR = await this.getExercisePR(exerciseId);

        // Check if this is a new PR
        if (!existingPR || current1RM > existingPR.oneRM) {
            const prData = {
                exerciseId: exerciseId,
                exerciseName: exerciseName,
                weight: weight,
                reps: reps,
                oneRM: current1RM,
                previousRM: existingPR ? existingPR.oneRM : null,
                date: new Date().toISOString()
            };

            // Save the new PR
            await this.savePersonalRecord(prData);

            return { isNewPR: true, data: prData };
        }

        return { isNewPR: false };
    },

    // Get existing PR for an exercise
    getExercisePR: async function (exerciseId) {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return null;
        }

        try {
            const prRef = window.Firebase.collection(
                window.Firebase.db,
                'users',
                AppState.currentUser.uid,
                'personal_records'
            );
            const q = window.Firebase.query(
                prRef,
                window.Firebase.where('exerciseId', '==', exerciseId),
                window.Firebase.orderBy('oneRM', 'desc'),
                window.Firebase.limit(1)
            );
            const snapshot = await window.Firebase.getDocs(q);

            if (!snapshot.empty) {
                return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            }
            return null;
        } catch (error) {
            console.error('❌ Erro ao buscar PR:', error);
            return null;
        }
    },

    // Save new personal record to Firebase
    savePersonalRecord: async function (recordData) {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            console.warn('Cannot save PR: user not logged in');
            return null;
        }

        const prEntry = {
            ...recordData,
            userId: AppState.currentUser.uid,
            createdAt: new Date().toISOString()
        };

        try {
            const prRef = window.Firebase.collection(
                window.Firebase.db,
                'users',
                AppState.currentUser.uid,
                'personal_records'
            );
            const docRef = await window.Firebase.addDoc(prRef, prEntry);
            console.log('🏆 Novo PR salvo:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Erro ao salvar PR:', error);
            return null;
        }
    },

    // Load all personal records
    loadPersonalRecords: async function () {
        if (!AppState.currentUser || !window.Firebase || !window.Firebase.db) {
            return [];
        }

        try {
            const prRef = window.Firebase.collection(
                window.Firebase.db,
                'users',
                AppState.currentUser.uid,
                'personal_records'
            );
            const q = window.Firebase.query(prRef, window.Firebase.orderBy('date', 'desc'));
            const snapshot = await window.Firebase.getDocs(q);

            const records = [];
            snapshot.forEach(doc => {
                records.push({ id: doc.id, ...doc.data() });
            });

            console.log(`✅ ${records.length} PRs carregados`);
            return records;
        } catch (error) {
            console.error('❌ Erro ao carregar PRs:', error);
            return [];
        }
    }
};

// Update Adaptive Status on Dashboard Card
function updateAdaptiveStatus() {
    const profile = MockAPI.userData.adaptiveProfile;
    const statusEl = document.getElementById('adaptive-status-text');
    if (statusEl) {
        if (profile && profile.onboardingComplete && profile.needs && profile.needs.length > 0) {
            const needsNames = {
                'visual': 'Visual',
                'wheelchair': 'Mobilidade',
                'rehab': 'Reabilitação',
                'low_impact': 'Baixo Impacto',
                'hearing': 'Auditivo'
            };
            const activeNeeds = profile.needs.map(n => needsNames[n] || n).slice(0, 2).join(', ');
            statusEl.textContent = activeNeeds + (profile.needs.length > 2 ? '...' : '');
            statusEl.classList.add('text-teal-600', 'font-semibold');
        } else {
            statusEl.textContent = 'Treinos personalizados';
            statusEl.classList.remove('text-teal-600', 'font-semibold');
        }
    }
}

// UI Functions
function updateQuickPanel() {
    const data = MockAPI.getData();

    // Metas Update
    const progress = MockAPI.calculateProgress();

    // Update Text: 75 -> 90 kg
    const weightDisplay = document.getElementById('goal-weight-current-target');
    if (weightDisplay) weightDisplay.textContent = progress.text;

    // Update Remaining: Faltam 15 kg
    const remDisplay = document.getElementById('goal-remaining-text');
    if (remDisplay) remDisplay.textContent = `Faltam ${progress.remaining} kg`;

    // Update Bar Width
    const bar = document.getElementById('goal-progress-bar');
    if (bar) bar.style.width = progress.percentage;

    // Metrics
    document.getElementById('card-volume').textContent = MockAPI.calculateVolume();

    // Adaptive zone
    const adaptiveCatEl = document.getElementById('adaptive-category');
    if (adaptiveCatEl) {
        const profile = MockAPI.userData.adaptiveProfile;
        if (profile && profile.needs && profile.needs.length > 0) {
            const needsNames = {
                'pregnancy': 'Gestante',
                'postpartum': 'Pós-parto',
                'senior': 'Terceira Idade',
                'wheelchair': 'Mobilidade',
                'rehab': 'Reabilitação',
                'low_impact': 'Baixo Impacto',
                'hearing': 'Auditivo'
            };
            const activeNeed = profile.needs[0];
            adaptiveCatEl.textContent = needsNames[activeNeed] || 'Personalizada';
        } else {
            adaptiveCatEl.textContent = 'Inteligente';
        }
    }
}

// Modal Logic
function openModal(type) {
    const container = document.getElementById('modal-container');
    const modals = document.querySelectorAll('[id^="modal-"]');
    modals.forEach(m => {
        if (m.id !== 'modal-container') m.classList.add('hidden');
    });

    const target = document.getElementById(`modal-${type}`);
    if (target) {
        container.classList.remove('hidden');
        // Trigger reflow
        void container.offsetWidth;
        container.classList.remove('opacity-0');

        target.classList.remove('hidden');

        // Populate Modal Data
        if (type === 'metas') {
            const data = MockAPI.getData();
            document.getElementById('modal-current-weight').textContent = data.currentWeight + ' kg';
            document.getElementById('modal-target-weight').textContent = data.targetWeight + ' kg';
            // Pre-fill input fields with current values
            document.getElementById('update-weight-input').value = data.currentWeight;
            document.getElementById('update-target-weight-input').value = data.targetWeight;
        } else if (type === 'metricas') {
            const breakdown = MockAPI.getBreakdown();
            const list = document.getElementById('modal-muscle-breakdown');
            list.innerHTML = breakdown.map(item => `
                        <div class="flex justify-between p-2 bg-gray-50 rounded">
                            <span>${item.name}</span>
                            <span class="font-bold">${item.pct}</span>
                        </div>
            `).join('');
        } else if (type === 'adaptive') {
            // Default behavior (if called without specific category usually via direct button, but we handle it in filterAdaptiveContent now)
            // If filterAdaptiveContent is called, it populates the list manually, so we don't want to overwrite it with empty default.

            // Only populate defaults if list is empty
            const list = document.getElementById('modal-suggestions');
            if (list && list.innerHTML.trim() === '') {
                const suggestions = MockAPI.getSuggestions();
                list.innerHTML = suggestions.map(item => `
            <div class="flex items-center p-2 border border-gray-100 rounded-lg">
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <i data-lucide="check" class="w-4 h-4 text-green-600"></i>
                                </div>
                                <div>
                                    <div class="font-bold text-sm">${item.name}</div>
                                    <div class="text-xs text-green-600">${item.type}</div>
                                </div>
                            </div>
            `).join('');
            }
        }
    }
}

function closeModal() {
    const container = document.getElementById('modal-container');
    container.classList.add('opacity-0');
    setTimeout(() => {
        container.classList.add('hidden');
        const modals = document.querySelectorAll('[id^="modal-"]');
        modals.forEach(m => {
            if (m.id !== 'modal-container') m.classList.add('hidden');
        });
    }, 300);
}

// ========================================
// 🏆 PR CELEBRATION FUNCTIONS
// ========================================

// Show PR celebration modal with data
function showPRCelebration(prData) {
    if (!prData) return;

    const container = document.getElementById('modal-container');
    const prModal = document.getElementById('modal-pr-celebration');

    // Populate the card with PR data
    const dateFormatted = new Date(prData.date).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    document.getElementById('pr-date').textContent = dateFormatted;
    document.getElementById('pr-exercise-name').textContent = prData.exerciseName || 'EXERCÍCIO';
    document.getElementById('pr-weight').textContent = prData.weight || 0;
    document.getElementById('pr-reps').textContent = prData.reps || 0;
    document.getElementById('pr-1rm').textContent = prData.oneRM || 0;

    // Show improvement if there was a previous PR
    const improvementEl = document.getElementById('pr-improvement');
    const improvementValueEl = document.getElementById('pr-improvement-value');
    if (prData.previousRM && prData.oneRM > prData.previousRM) {
        const improvement = Math.round((prData.oneRM - prData.previousRM) * 10) / 10;
        improvementValueEl.textContent = improvement;
        improvementEl.classList.remove('hidden');
    } else {
        improvementEl.classList.add('hidden');
    }

    // Show the modal with animation
    container.classList.remove('hidden');
    prModal.classList.remove('hidden');

    // Trigger entrance animation
    setTimeout(() => {
        container.classList.remove('opacity-0');
        prModal.style.transform = 'scale(1)';
        prModal.style.opacity = '1';
    }, 50);

    // Initialize Lucide icons in the modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Store current PR data for sharing
    window.currentPRData = prData;

    console.log('🎉 Mostrando celebração de PR:', prData);
}

// Close PR celebration modal
function closePRCelebration() {
    const container = document.getElementById('modal-container');
    const prModal = document.getElementById('modal-pr-celebration');

    prModal.style.transform = 'scale(0.95)';
    prModal.style.opacity = '0';
    container.classList.add('opacity-0');

    setTimeout(() => {
        container.classList.add('hidden');
        prModal.classList.add('hidden');
        prModal.style.transform = '';
        prModal.style.opacity = '';
    }, 300);

    window.currentPRData = null;
}

// Share PR Card as image
async function sharePRCard() {
    const card = document.getElementById('pr-celebration-card');
    if (!card) {
        alert('Erro ao gerar imagem');
        return;
    }

    try {
        // Create canvas from the card
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rect = card.getBoundingClientRect();

        // Set canvas size (2x for better quality)
        const scale = 2;
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        // Draw background
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw gradient accent
        const gradient = ctx.createLinearGradient(canvas.width * 0.7, 0, canvas.width, canvas.height * 0.4);
        gradient.addColorStop(0, 'rgba(225, 103, 22, 0.2)');
        gradient.addColorStop(1, 'rgba(225, 103, 22, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw "NOVO RECORDE" badge
        const badgeY = 40 * scale;
        ctx.fillStyle = '#e16716';
        ctx.fillRect(24 * scale, badgeY, 160 * scale, 28 * scale);
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText('🏆 NOVO RECORDE', 32 * scale, badgeY + 19 * scale);

        // Draw date
        const dateText = document.getElementById('pr-date').textContent;
        ctx.font = `${10 * scale}px monospace`;
        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'right';
        ctx.fillText(dateText, canvas.width - 24 * scale, badgeY + 16 * scale);

        // Draw exercise name
        const exerciseName = document.getElementById('pr-exercise-name').textContent;
        ctx.font = `bold ${28 * scale}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText(exerciseName, 24 * scale, canvas.height * 0.45);

        // Draw stats
        const statsY = canvas.height * 0.55;
        const colWidth = (canvas.width - 48 * scale) / 3;

        // Left border accent
        ctx.fillStyle = 'rgba(225, 103, 22, 0.5)';
        ctx.fillRect(24 * scale, statsY, 2 * scale, 50 * scale);

        // Peso
        ctx.font = `${9 * scale}px Arial`;
        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'left';
        ctx.fillText('PESO', 32 * scale, statsY + 12 * scale);
        ctx.font = `bold ${22 * scale}px Arial`;
        ctx.fillStyle = 'white';
        ctx.fillText(document.getElementById('pr-weight').textContent + ' kg', 32 * scale, statsY + 40 * scale);

        // Reps
        ctx.font = `${9 * scale}px Arial`;
        ctx.fillStyle = '#6B7280';
        ctx.fillText('REPS', 32 * scale + colWidth, statsY + 12 * scale);
        ctx.font = `bold ${22 * scale}px Arial`;
        ctx.fillStyle = 'white';
        ctx.fillText(document.getElementById('pr-reps').textContent, 32 * scale + colWidth, statsY + 40 * scale);

        // 1RM
        ctx.font = `${9 * scale}px Arial`;
        ctx.fillStyle = '#6B7280';
        ctx.fillText('1RM', 32 * scale + colWidth * 2, statsY + 12 * scale);
        ctx.font = `bold ${22 * scale}px Arial`;
        ctx.fillStyle = '#e16716';
        ctx.fillText(document.getElementById('pr-1rm').textContent + ' kg', 32 * scale + colWidth * 2, statsY + 40 * scale);

        // Draw branding
        ctx.font = `bold ${10 * scale}px Arial`;
        ctx.fillStyle = '#6B7280';
        ctx.textAlign = 'left';
        ctx.fillText('POWERUP', 56 * scale, canvas.height - 24 * scale);

        ctx.font = `${8 * scale}px monospace`;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#4B5563';
        ctx.fillText('#PR #RECORDE #POWERUP', canvas.width - 24 * scale, canvas.height - 24 * scale);

        // Convert to blob and share
        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert('Erro ao gerar imagem');
                return;
            }

            const file = new File([blob], 'powerup-pr.png', { type: 'image/png' });

            // Try Web Share API first
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Novo Recorde Pessoal! 🏆',
                        text: `Bati meu recorde em ${window.currentPRData?.exerciseName || 'exercício'} !1RM: ${window.currentPRData?.oneRM || 0} kg`,
                        files: [file]
                    });
                    console.log('✅ PR compartilhado com sucesso!');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        downloadPRImage(blob);
                    }
                }
            } else {
                // Fallback: download the image
                downloadPRImage(blob);
            }
        }, 'image/png', 1.0);

    } catch (error) {
        console.error('❌ Erro ao gerar imagem:', error);
        alert('Erro ao gerar imagem. Tente novamente.');
    }
}

// Download PR image as fallback
function downloadPRImage(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `powerup - pr - ${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Imagem baixada com sucesso!');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateQuickPanel();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

window.MockAPI = MockAPI;
window.openModal = openModal;
window.closeModal = closeModal;
window.updateQuickPanel = updateQuickPanel;

// window.Firebase and other globals defined above

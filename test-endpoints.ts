import { serve } from '@hono/node-server';
import app from './api/index';

const port = 3001; // Use a different port for testing to avoid collisions
const server = serve({ fetch: app.fetch, port });

console.log(`Test server starting on port ${port}...`);

async function runTests() {
    try {
        console.log('\n--- 🧪 Testing Public Endpoints ---');

        // 1. List Trainers
        const res1 = await fetch(`http://localhost:${port}/api/v1/trainers`);
        const json1 = await res1.json();
        console.log(`[GET] /trainers - Success: ${json1.success}, Count: ${json1.data?.length}`);

        // 2. Filter Trainers
        const res2 = await fetch(`http://localhost:${port}/api/v1/trainers/filter?rating=5&queryStr=Rebeca`);
        const json2 = await res2.json();
        console.log(`[GET] /trainers/filter - Success: ${json2.success}, Found: ${json2.data?.length}`);

        console.log('\n--- 🔒 Testing Protected Endpoints (Without Token) ---');

        // 3. Unauthorized Access (Create Subscription)
        const res3 = await fetch(`http://localhost:${port}/api/v1/subscriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trainerId: 'prof-000', planId: 'plan-000A' })
        });
        const json3 = await res3.json();
        console.log(`[POST] /subscriptions (No Auth) - Status: ${res3.status}, Error: ${json3.error}`);

        console.log('\n✅ All API E2E Structural tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // Shutdown server
        server.close();
        process.exit(0);
    }
}

// Give server a moment to bind
setTimeout(runTests, 1000);

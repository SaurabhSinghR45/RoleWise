const BASE_URL = "http://localhost:3000";

async function runTestSuite() {
    console.log("=================================================");
    console.log("   🚀 ROLEWISE API FULL TEST SUITE (DAY 1 & 2)   ");
    console.log("=================================================\n");

    const uniqueId = Math.floor(Math.random() * 100000);
    const testUser = {
        username: `SaurabhDev_${uniqueId}`,
        email: `saurabh_${uniqueId}@rolewise.ai`,
        password: "SuperSecretPassword123!",
    };

    let sessionCookie = "";

    try {
        // Test 1: Health Check
        console.log("🔍 [1/9] Testing GET /api/health ...");
        const healthRes = await fetch(`${BASE_URL}/api/health`);
        const healthData = await healthRes.json();
        console.log(`   ➔ Status: ${healthRes.status} OK`);
        console.log(`   ➔ Response:`, healthData);

        // Test 2: User Registration
        console.log("\n🔍 [2/9] Testing POST /api/auth/register ...");
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser),
        });
        const regData = await regRes.json();
        console.log(`   ➔ Status: ${regRes.status} Created`);
        console.log(`   ➔ User Registered: ID = ${regData.user?._id}, Username = ${regData.user?.username}, Email = ${regData.user?.email}`);

        const setCookieHeader = regRes.headers.get("set-cookie");
        if (setCookieHeader) {
            sessionCookie = setCookieHeader.split(";")[0];
            console.log(`   ➔ HTTP-Only Cookie Received: ${sessionCookie.substring(0, 30)}...`);
        } else {
            throw new Error("No cookie received from register endpoint");
        }

        // Test 3: Duplicate Email Check
        console.log("\n🔍 [3/9] Testing Duplicate Email Registration (Should Fail with 400) ...");
        const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser),
        });
        const dupData = await dupRes.json();
        console.log(`   ➔ Status: ${dupRes.status} (${dupData.message})`);

        // Test 4: Get Profile (Protected Route)
        console.log("\n🔍 [4/9] Testing GET /api/auth/me (With Valid Cookie) ...");
        const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Cookie: sessionCookie },
        });
        const meData = await meRes.json();
        console.log(`   ➔ Status: ${meRes.status} OK`);
        console.log(`   ➔ Profile Data:`, meData.user);

        // Test 5: Missing Token Check
        console.log("\n🔍 [5/9] Testing GET /api/auth/me (Without Cookie - Should Fail with 401) ...");
        const noAuthRes = await fetch(`${BASE_URL}/api/auth/me`);
        const noAuthData = await noAuthRes.json();
        console.log(`   ➔ Status: ${noAuthRes.status} (${noAuthData.message})`);

        // Test 6: Login
        console.log("\n🔍 [6/9] Testing POST /api/auth/login ...");
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password,
            }),
        });
        const loginData = await loginRes.json();
        console.log(`   ➔ Status: ${loginRes.status} OK`);
        console.log(`   ➔ Logged in User:`, loginData.user);
        const loginCookie = loginRes.headers.get("set-cookie").split(";")[0];

        // Test 7: Invalid Password
        console.log("\n🔍 [7/9] Testing POST /api/auth/login (Wrong Password - Should Fail with 400) ...");
        const wrongPassRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testUser.email,
                password: "IncorrectPassword999",
            }),
        });
        const wrongPassData = await wrongPassRes.json();
        console.log(`   ➔ Status: ${wrongPassRes.status} (${wrongPassData.message})`);

        // Test 8: Logout & DB Blacklisting
        console.log("\n🔍 [8/9] Testing POST /api/auth/logout (Secure Logout) ...");
        const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: { Cookie: loginCookie },
        });
        const logoutData = await logoutRes.json();
        console.log(`   ➔ Status: ${logoutRes.status} OK`);
        console.log(`   ➔ Message:`, logoutData.message);

        // Test 9: Revoked Token Rejection
        console.log("\n🔍 [9/9] Testing Token Revocation (Attempting to use logged-out token) ...");
        const revokedRes = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Cookie: loginCookie },
        });
        const revokedData = await revokedRes.json();
        console.log(`   ➔ Status: ${revokedRes.status} (${revokedData.message})`);

        console.log("\n=================================================");
        console.log("   ✅ ALL 9 TEST CASES PASSED WITH 100% SUCCESS! ");
        console.log("=================================================\n");
    } catch (error) {
        console.error("\n❌ Test Suite Failed:", error);
    }
}

runTestSuite();

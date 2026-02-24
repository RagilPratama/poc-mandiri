// Simple test script for IKU and IKI APIs
const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing IKU and IKI APIs...\n');

  try {
    // Test IKU endpoints
    console.log('1️⃣ Testing GET /iku');
    const ikuResponse = await fetch(`${BASE_URL}/iku`);
    const ikuData = await ikuResponse.json();
    console.log('✅ IKU List:', JSON.stringify(ikuData, null, 2));
    console.log('');

    // Test IKI endpoints
    console.log('2️⃣ Testing GET /iki');
    const ikiResponse = await fetch(`${BASE_URL}/iki`);
    const ikiData = await ikiResponse.json();
    console.log('✅ IKI List:', JSON.stringify(ikiData, null, 2));
    console.log('');

    // Test IKU by ID
    if (ikuData.data?.data?.length > 0) {
      const firstIkuId = ikuData.data.data[0].id;
      console.log(`3️⃣ Testing GET /iku/${firstIkuId}`);
      const ikuByIdResponse = await fetch(`${BASE_URL}/iku/${firstIkuId}`);
      const ikuByIdData = await ikuByIdResponse.json();
      console.log('✅ IKU Detail:', JSON.stringify(ikuByIdData, null, 2));
      console.log('');
    }

    // Test IKI by ID
    if (ikiData.data?.data?.length > 0) {
      const firstIkiId = ikiData.data.data[0].id;
      console.log(`4️⃣ Testing GET /iki/${firstIkiId}`);
      const ikiByIdResponse = await fetch(`${BASE_URL}/iki/${firstIkiId}`);
      const ikiByIdData = await ikiByIdResponse.json();
      console.log('✅ IKI Detail:', JSON.stringify(ikiByIdData, null, 2));
      console.log('');
    }

    console.log('🎉 All tests passed!');
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure the server is running on port 3000');
  }
}

testAPI();

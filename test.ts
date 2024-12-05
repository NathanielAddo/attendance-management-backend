import axios from 'axios';

async function testSystem() {
  try {
    // Test bundle creation and serving
    const response = await axios.get('http://localhost:3000/api/query/test_query', {
      params: {
        query: 'SELECT * FROM users LIMIT 10',
      },
    });

    console.log('Bundle URL:', response.request.res.responseUrl);

    // Test cache invalidation
    await axios.post('http://localhost:3000/api/invalidate/test_query');
    console.log('Cache invalidation successful');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSystem();


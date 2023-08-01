const axios = require('axios');

const dataToSend = {
    key: 'value',
};



axios.post('http://localhost:3000/process', dataToSend)
    .then((response) => {
        console.log('Response:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

import axios from 'axios';

const API_URL = 'https://localhost:7247/Requets';

const fetchRequests = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
    }
};

export default fetchRequests;
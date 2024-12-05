import axios from 'axios';

const API_URL = 'https://imsearlyleaveserver.azurewebsites.net/Requets';

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
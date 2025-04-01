import axios from 'axios';

const API_KEY = '';
const BASE_URL = 'https://techhk.aoscdn.com/';
const POLLING_INTERVAL = 2000; // Milliseconds
const MAX_RETRIES = 20;

export const enhancedImageAPI = async (file) => {
    try {
        const taskId = await uploadImage(file);
        const enhancedImageData = await pollForEnhancedImage(taskId);
        return enhancedImageData;
    } catch (error) {
        console.error("Error enhancing image:", error);
        throw error;
    }
};

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image_file', file);

    try {
        const { data } = await axios.post(`${BASE_URL}/api/tasks/visual/scale`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-API-KEY': API_KEY,
            },
        });

        if (!data || !data.data || !data.data.task_id) {
            console.error("Upload API response:", data);
            throw new Error('Failed to upload image: Invalid response format');
        }
        return data.data.task_id;
    } catch (error) {
        console.error("Error during image upload:", error);
        throw error;
    }
};

const fetchTaskResult = async (taskId) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/tasks/visual/scale/${taskId}`, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        });

        if (!data || !data.data) {
            console.error("Fetch task result API response:", data);
            throw new Error('Failed to fetch task result: No data returned');
        }
        return data.data;
    } catch (error) {
        console.error(`Error fetching task result for task ID ${taskId}:`, error);
        throw error;
    }
};

const pollForEnhancedImage = async (taskId, retries = 0) => {
    try {
        const result = await fetchTaskResult(taskId);
        const { progress, state, ...rest } = result;

        if (state < 0) {
            console.error(`Task ID ${taskId} failed with state:`, state, result);
            throw new Error(`Image enhancement failed with state: ${state}`);
        }

        if (progress >= 100) {
            console.log(`Task ID ${taskId} completed with state: ${state}, progress: ${progress}`);
            return { progress, state, ...rest }; // Return the full result
        }

        if (retries >= MAX_RETRIES) {
            console.warn(`Max retries reached for task ID ${taskId}. Current state: ${state}, progress: ${progress}`);
            throw new Error('Max retries reached: Unable to enhance image');
        }

        console.log(`Task ID ${taskId}: Processing (state: ${state}, progress: ${progress}), retrying in ${POLLING_INTERVAL / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
        return pollForEnhancedImage(taskId, retries + 1);

    } catch (error) {
        console.error(`Error during polling for task ID ${taskId} (retry ${retries}):`, error);
        throw error;
    }
};

import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Cambia esto según tu configuración

export const registerGrade = async (grade) => {
    return await axios.post(`${API_URL}/grades`, grade);
};

export const getGrades = async (studentId) => {
    return await axios.get(`${API_URL}/grades`, { params: { studentId } });
};


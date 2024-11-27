import axios from './root.service.js';
import { formatGradeData } from '@helpers/formatData.js';

export const getGradesService = async () => {
  try {
    const { data } = await axios.get('/grades');
    //const formattedData = data.data.map(formatGradeData);
    return [data];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al obtener las calificaciones'];
  }
};


export const registerGrade = async (gradeData) => {
  try {
    const response = await axios.post('/grades', gradeData);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al registrar la calificación'];
  }
};

export const updateGradeService = async (id, gradeData) => {
  try {
    const response = await axios.put(`/grades/${id}`, gradeData);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al actualizar la calificación'];
  }
};

export const deleteGradeService = async (id) => {
  try {
    const response = await axios.delete(`/grades/${id}`);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al eliminar la calificación'];
  }
};


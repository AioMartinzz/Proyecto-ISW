import axios from 'axios';

export const getGradesService = async () => {
    
  try {
    const response = await axios.get(`${API_URL}/grades`);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al obtener las calificaciones'];
  }
};

export const registerGrade = async (gradeData) => {
  try {
    const response = await axios.post(`${API_URL}/grades`, gradeData);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al registrar la calificación'];
  }
};

export const updateGradeService = async (id, gradeData) => {
  try {
    const response = await axios.put(`${API_URL}/grades/${id}`, gradeData);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al actualizar la calificación'];
  }
};

export const deleteGradeService = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/grades/${id}`);
    return [response.data, null];
  } catch (error) {
    return [null, error.response?.data?.message || 'Error al eliminar la calificación'];
  }
};


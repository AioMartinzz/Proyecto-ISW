import { useCallback } from 'react';

const useDeleteGrade = (setGrades) => {
  const handleDelete = useCallback(async (grade_id) => {
    if (!grade_id) {
      console.error('No se proporcionó un grade_id para eliminar.');
      return;
    }

    try {
      const response = await fetch(`/api/grades/${grade_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la calificación');
      }

      // Actualiza el estado después de eliminar
      setGrades((prevGrades) => prevGrades.filter((grade) => grade.grade_id !== grade_id));
    } catch (error) {
      console.error('Error en la eliminación:', error);
      // Manejo de errores, podrías mostrar un mensaje al usuario aquí
    }
  }, [setGrades]);

  return { handleDelete };
};

export default useDeleteGrade; 
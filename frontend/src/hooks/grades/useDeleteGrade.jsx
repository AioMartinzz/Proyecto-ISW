import { useCallback } from 'react';
import { deleteGradeService } from '../../services/grade.service';

const useDeleteGrade = (setGrades, setMessage) => {
  const handleDelete = useCallback(async (grade_id) => {
    if (!grade_id) {
      setMessage({ text: 'ID de calificación no válido', type: 'error' });
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar esta calificación?')) {
      try {
        const [data, error] = await deleteGradeService(grade_id);
        
        if (error) {
          throw new Error(error);
        }

        setGrades(prevGrades => 
          prevGrades.filter(grade => grade.grade_id !== grade_id)
        );
        setMessage({ text: 'Calificación eliminada exitosamente', type: 'success' });
      } catch (error) {
        console.error('Error en la eliminación:', error);
        setMessage({ text: `Error al eliminar la calificación: ${error.message}`, type: 'error' });
      }
    }
  }, [setGrades, setMessage]);

  return { handleDelete };
};

export default useDeleteGrade; 
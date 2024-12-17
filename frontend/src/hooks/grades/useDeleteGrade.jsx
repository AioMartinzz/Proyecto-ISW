import { useCallback } from 'react';
import { deleteGradeService } from '../../services/grade.service';

const useDeleteGrade = (setGrades) => {
  const handleDelete = useCallback(async (grade_id) => {
    if (!grade_id) {
      console.error('No se proporcionó un grade_id para eliminar.');
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar esta calificación?')) {
      try {
        console.log('Intentando eliminar grade_id:', grade_id);
        const [data, error] = await deleteGradeService(grade_id);
        
        if (error) {
          console.error('Error del servidor:', error);
          throw new Error(error);
        }

        setGrades(prevGrades => 
          prevGrades.filter(grade => grade.grade_id !== grade_id)
        );
      } catch (error) {
        console.error('Error en la eliminación:', error);
        alert('Error al eliminar la calificación');
      }
    }
  }, [setGrades]);

  return { handleDelete };
};

export default useDeleteGrade; 
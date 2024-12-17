import { useState } from 'react';
import { updateGradeService } from '../../services/grade.service';

const useEditGrade = (setGrades, setMessage) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const handleClickUpdate = (grade) => {
    setSelectedGrade(grade);
    setIsPopupOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      if (!updatedData.nota || updatedData.nota < 1.0 || updatedData.nota > 7.0) {
        setMessage({ text: 'La calificación debe estar entre 1.0 y 7.0', type: 'error' });
        return;
      }

      const [data, error] = await updateGradeService(updatedData.grade_id, {
        nota: parseFloat(updatedData.nota)
      });

      if (error) {
        throw new Error(error);
      }

      setGrades(prevGrades =>
        prevGrades.map(grade =>
          grade.grade_id === updatedData.grade_id ? data : grade
        )
      );
      setIsPopupOpen(false);
      setMessage({ text: 'Calificación actualizada exitosamente', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: `Error al actualizar la calificación: ${error.message}`, type: 'error' });
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    selectedGrade,
    setSelectedGrade
  };
};

export default useEditGrade;
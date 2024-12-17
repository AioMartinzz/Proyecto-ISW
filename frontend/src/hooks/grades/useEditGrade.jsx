import { useState } from 'react';
import { updateGradeService } from '../../services/grade.service';

const useEditGrade = (setGrades) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const handleClickUpdate = (grade) => {
    setSelectedGrade(grade);
    setIsPopupOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    const [data, error] = await updateGradeService(updatedData.grade_id, {
      nota: parseFloat(updatedData.nota)
    });

    if (!error) {
      setGrades((prevGrades) =>
        prevGrades.map((grade) =>
          grade.grade_id === updatedData.grade_id ? data : grade
        )
      );
      setIsPopupOpen(false);
    } else {
      console.error(error);
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    selectedGrade,
    setSelectedGrade,
  };
};

export default useEditGrade;
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
    const [updatedGrade, error] = await updateGradeService(selectedGrade.id, updatedData);
    if (!error) {
      setGrades((prevGrades) =>
        prevGrades.map((grade) => (grade.id === updatedGrade.id ? updatedGrade : grade))
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
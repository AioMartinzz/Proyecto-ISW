import { deleteGradeService } from '../../services/grade.service';

const useDeleteGrade = (setGrades) => {
  const handleDelete = async (gradeId) => {
    const [deletedGrade, error] = await deleteGradeService(gradeId);
    if (!error) {
      setGrades((prevGrades) => prevGrades.filter((grade) => grade.id !== deletedGrade.id));
    } else {
      console.error(error);
    }
  };

  return { handleDelete };
};

export default useDeleteGrade; 
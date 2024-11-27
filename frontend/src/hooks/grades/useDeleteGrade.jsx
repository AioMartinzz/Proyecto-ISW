import { deleteGradeService } from '../../services/grade.service';

const useDeleteGrade = (setGrades) => {
  const handleDelete = async (grade_id) => {
    const [deletedGrade, error] = await deleteGradeService(grade_id);
    if (!error) {
      setGrades((prevGrades) => prevGrades.filter((grade) => grade.id !== deletedGrade.id));
    } else {
      console.error(error);
    }
  };

  return { handleDelete };
};

export default useDeleteGrade; 
import { useMemo } from 'react';

const useFilteredGrades = (grades, userInfo) => {
  return useMemo(() => {
    if (userInfo.role === 'ALUMNO') {
      return grades.filter(grade => grade.estudiante_id === userInfo.id);
    } else if (userInfo.role === 'PROFESOR') {
      return grades.filter(grade => grade.asignatura_id === userInfo.asignatura_id);
    }
    return grades; // ADMINISTRADOR ve todas las calificaciones
  }, [grades, userInfo]);
};

export default useFilteredGrades; 
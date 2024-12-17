import React from 'react';
import Table from './Table'; // Asegúrate de que Table sea un componente genérico

const GradesTable = ({ grades, columns, onSelectionChange, selectedGrades }) => {
  const handleCheckboxChange = (grade) => {
    onSelectionChange((prevSelected) => {
      const isSelected = prevSelected.some((g) => g.grade_id === grade.grade_id);
      if (isSelected) {
        return prevSelected.filter((g) => g.grade_id !== grade.grade_id);
      } else {
        return [...prevSelected, grade];
      }
    });
  };

  return (
    <Table
      data={grades}
      columns={columns}
      onSelectionChange={onSelectionChange}
    />
  );
};

export default GradesTable;

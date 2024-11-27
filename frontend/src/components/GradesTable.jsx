import React from 'react';
import Table from './Table'; // Asegúrate de que Table sea un componente genérico

const GradesTable = ({ grades, columns, onSelectionChange }) => {
  return (
    <Table
      data={grades}
      columns={columns}
      onSelectionChange={onSelectionChange}
    />
  );
};

export default GradesTable;

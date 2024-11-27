import React from 'react';
import Table from '@components/Table'; // Asegúrate de que este componente esté bien implementado

const GradesTable = ({ grades }) => {
  const columns = [
    { title: "Grade ID", field: "grade_id" },
    { title: "Estudiante ID", field: "estudiante_id" },
    { title: "Asignatura ID", field: "asignatura_id" },
    { title: "Fecha de Creación", field: "fechacreacion" },
    { title: "Nota", field: "nota" }
  ];

  return (
    <Table
      data={grades} 
      columns={columns} 
    />
  );
};

export default GradesTable;

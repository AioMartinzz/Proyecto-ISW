import React from 'react';
import Table from './Table';

const GradesTable = ({ grades, columns }) => {
  return (
    <Table
      data={grades}
      columns={columns}
    />
  );
};

export default GradesTable;

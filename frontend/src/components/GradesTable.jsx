import React from 'react';
import Table from './Table';

const GradesTable = ({ grades, columns, filter, dataToFilter }) => {
  return (
    <Table
      data={grades}
      columns={columns}
      filter={filter}
      dataToFilter={dataToFilter}
    />
  );
};

export default GradesTable;

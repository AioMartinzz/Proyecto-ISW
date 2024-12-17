import useTable from '@hooks/table/useTable.jsx';

export default function Table({ data, columns, filter, dataToFilter, initialSortName, onSelectionChange, selectable = false }) {
  const { tableRef } = useTable({ 
    data, 
    columns: columns.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          formatter: function(cell, formatterParams, onRendered) {
            const rowData = cell.getRow().getData();
            const container = document.createElement('div');
            container.className = 'action-buttons';
            
            const editButton = document.createElement('button');
            editButton.className = 'action-button edit-button';
            editButton.innerHTML = '<i class="fas fa-pen-to-square"></i>';
            editButton.onclick = (e) => {
              e.stopPropagation();
              const renderResult = col.render(rowData);
              renderResult.props.children[0].props.onClick();
            };
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'action-button delete-button';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.onclick = (e) => {
              e.stopPropagation();
              const renderResult = col.render(rowData);
              renderResult.props.children[1].props.onClick();
            };
            
            container.appendChild(editButton);
            container.appendChild(deleteButton);
            
            return container;
          },
          hozAlign: "center",
          headerSort: false
        };
      }
      return col;
    }), 
    filter, 
    dataToFilter, 
    initialSortName, 
    onSelectionChange,
    selectable
  });

  return (
    <div className='table-container'>
      <div ref={tableRef}></div>
    </div>
  );
}
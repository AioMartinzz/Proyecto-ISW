import { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import '@styles/table.css';

function useTable({ data, columns, filter, dataToFilter, initialSortName }) {
    const tableRef = useRef(null);
    const [table, setTable] = useState(null);
    const [isTableBuilt, setIsTableBuilt] = useState(false);

    useEffect(() => {
        if (tableRef.current) {
            const tabulatorTable = new Tabulator(tableRef.current, {
                data: [],
                columns: columns,
                layout: "fitDataStretch",
                responsiveLayout: "hide",
                responsiveLayoutCollapseStartOpen: false,
                responsiveLayoutCollapseUseFormatters: true,
                pagination: true,
                paginationSize: 6,
                rowHeight: 46,
                selectable: false,
                width: '100%',
                responsiveLayoutCollapseStart: 800,
                columnDefaults: {
                    resizable: true,
                    responsive: 1
                },
                langs: {
                    "default": {
                        "pagination": {
                            "first": "Primero",
                            "prev": "Anterior",
                            "next": "Siguiente",
                            "last": "Último",
                        }
                    }
                },
                initialSort: [
                    { column: initialSortName, dir: "asc" }
                ],
            });

            tabulatorTable.on("tableBuilt", function() {
                setIsTableBuilt(true);
            });
            
            setTable(tabulatorTable);
            
            return () => {
                tabulatorTable.destroy();
                setIsTableBuilt(false);
                setTable(null);
            };
        }
    }, []);

    useEffect(() => {
        if (table && isTableBuilt) {
            table.replaceData(data);
        }
    }, [data, table, isTableBuilt]);

    useEffect(() => {
        if (table && isTableBuilt) {
            if (filter) {
                table.setFilter(function(data){
                    return dataToFilter.some(field => 
                        data[field]?.toLowerCase().includes(filter.toLowerCase())
                    );
                });
            } else {
                table.clearFilter();
            }
            table.redraw();
        }
    }, [filter, table, dataToFilter, isTableBuilt]);

    return { tableRef };
}
export default useTable;
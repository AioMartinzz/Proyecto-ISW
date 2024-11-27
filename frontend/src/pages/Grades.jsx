import React, { useState, useCallback } from 'react';
import Table from '@components/Table';
import Search from '../components/Search';
import Popup from '../components/Popup';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import useGrades from '@hooks/grades/useGetGrades';
import useEditGrade from '@hooks/grades/useEditGrade';
import useDeleteGrade from '@hooks/grades/useDeleteGrade';
import '@styles/grades.css';

const Grades = () => {
  const { grades, setGrades, loading } = useGrades();
  const [filterStudent, setFilterStudent] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    selectedGrade,
    setSelectedGrade
  } = useEditGrade(setGrades);

  const { handleDelete } = useDeleteGrade(setGrades);

  const handleFilterChange = (e) => {
    setFilterStudent(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedItems) => {
    setSelectedGrades(selectedItems);
    setSelectedGrade(selectedItems[0]); // Para mantener compatibilidad con el popup de edición
  }, [setSelectedGrade]);

  const columns = [
    { title: "Estudiante ID", field: "studentId", width: 150, responsive: 0 },
    { title: "Asignatura ID", field: "subjectId", width: 150, responsive: 0 },
    { title: "Calificación", field: "score", width: 150, responsive: 0 },
    { title: "Fecha", field: "createdAt", width: 200, responsive: 2 }
  ];

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Calificaciones</h1>
          <div className='filter-actions'>
            <Search 
              value={filterStudent} 
              onChange={handleFilterChange} 
              placeholder={'Filtrar por ID de estudiante'} 
            />
            <button 
              onClick={() => handleClickUpdate(selectedGrades[0])} 
              disabled={selectedGrades.length !== 1}
            >
              {selectedGrades.length !== 1 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button 
              className='delete-grade-button' 
              disabled={selectedGrades.length === 0}
              onClick={() => handleDelete(selectedGrades[0].id)}
            >
              {selectedGrades.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={grades}
          columns={columns}
          filter={filterStudent}
          dataToFilter={'studentId'}
          initialSortName={'createdAt'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup 
        show={isPopupOpen} 
        setShow={setIsPopupOpen} 
        data={selectedGrade}
        action={handleUpdate}
      >
        <div className="popup-content">
          <h2>Editar Calificación</h2>
          <input
            type="number"
            name="score"
            placeholder="Nueva calificación"
            min="1"
            max="7"
            step="0.1"
            required
          />
        </div>
      </Popup>
    </div>
  );
};

export default Grades; 
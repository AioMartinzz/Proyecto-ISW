import React, { useState, useCallback } from 'react';
import Table from '@components/Table';
import Search from '../components/Search';
import RegisterGrade from '../components/RegisterGrade';
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
  const [message, setMessage] = useState('');

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
    setSelectedGrade(selectedItems[0]);
  }, [setSelectedGrade]);

  const columns = [
    { title: "Estudiante ID", field: "studentId", width: 150, responsive: 0 },
    { title: "Asignatura ID", field: "subjectId", width: 150, responsive: 0 },
    { title: "Calificación", field: "score", width: 150, responsive: 0 },
    { title: "Fecha", field: "createdAt", width: 200, responsive: 2 }
  ];

  const handleRegisterSuccess = () => {
    setMessage('Calificación registrada correctamente.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRegisterError = (error) => {
    setMessage(`Error al registrar la calificación: ${error.message}`);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className='main-container'>
      {message && <div className='message'>{message}</div>}
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

      <RegisterGrade onSuccess={handleRegisterSuccess} onError={handleRegisterError} />
    </div>
  );
};

export default Grades; 
import React, { useState, useCallback, useEffect } from 'react';
import Search from '../components/Search';
import RegisterGrade from '../components/RegisterGrade';
import GradesTable from '../components/GradesTable';
import useGetGrades from '@hooks/grades/useGetGrades';
import useEditGrade from '@hooks/grades/useEditGrade';
import useDeleteGrade from '@hooks/grades/useDeleteGrade';
import '@styles/grades.css';

const Grades = () => {
  const { grades = [], setGrades, loading, error } = useGetGrades(); // Añadimos manejo de errores
  const [filterStudent, setFilterStudent] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    selectedGrade,
    setSelectedGrade
  } = useEditGrade(setGrades, setMessage);

  const { handleDelete } = useDeleteGrade(setGrades, setMessage);

  const handleFilterChange = (e) => {
    setFilterStudent(e.target.value);
  };

  const handleSelectionChange = useCallback(
    (selectedItems) => {
      setSelectedGrades(selectedItems);
      setSelectedGrade(selectedItems[0]);
    },
    [setSelectedGrade]
  );

  const filteredGrades = filterStudent
    ? grades.filter((grade) => 
        String(grade.estudiante_id).includes(filterStudent)
      )
    : grades;

  const columns = [
    {
      title: 'Estudiante ID',
      field: 'estudiante_id',
      width: '15%',
      responsive: 0
    },
    {
      title: 'Asignatura ID',
      field: 'asignatura_id',
      width: '15%',
      responsive: 0
    },
    {
      title: 'Nota',
      field: 'nota',
      width: '15%',
      responsive: 0
    },
    {
      title: 'Fecha de Creación',
      field: 'fechacreacion',
      width: '35%',
      responsive: 1,
      formatter: (cell) => {
        const date = new Date(cell.getValue());
        const formattedDate = date.toLocaleString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        return formattedDate.replace(',', '');
      }
    },
    {
      title: 'Acciones',
      field: 'actions',
      width: '20%',
      responsive: 0,
      render: (rowData) => (
        <div className="action-buttons">
          <button 
            className="action-button edit-button"
            onClick={() => handleClickUpdate(rowData)}
          >
            <i className="fas fa-pen-to-square"></i>
          </button>
          <button 
            className="action-button delete-button"
            onClick={() => handleDelete(rowData.grade_id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const handleRegisterSuccess = () => {
    setMessage({ text: 'Calificación registrada exitosamente', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleRegisterError = (error) => {
    setMessage({ 
      text: `Error al registrar la calificación: ${error.message}`, 
      type: 'error' 
    });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    if (message.text) {
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  }, [message]);

  if (loading) {
    return <div>Cargando calificaciones...</div>;
  }

  if (error) {
    return <div>Error al cargar calificaciones: {error}</div>;
  }

  if (!filteredGrades || filteredGrades.length === 0) {
    return <div>No hay calificaciones disponibles.</div>;
  }

  return (
    <div className="main-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Calificaciones</h1>
          <div className="filter-actions">
            <button
              className="register-button"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Registrar Calificación
            </button>
            <Search
              value={filterStudent}
              onChange={handleFilterChange}
              placeholder={'Filtrar por ID de estudiante'}
            />
          </div>
        </div>
        
        <GradesTable
          grades={filteredGrades}
          columns={columns}
        />
      </div>

      <RegisterGrade 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        onError={handleRegisterError}
      />

      {isPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modificar Calificación</h2>
            
            <div className="grade-info">
              <p><strong>Estudiante ID:</strong> {selectedGrade?.estudiante_id}</p>
              <p><strong>Asignatura ID:</strong> {selectedGrade?.asignatura_id}</p>
            </div>

            <label className="grade-label">Nueva calificación:</label>
            <input
              type="number"
              min="1.0"
              max="7.0"
              step="0.1"
              value={selectedGrade?.nota || ''}
              onChange={(e) => setSelectedGrade({...selectedGrade, nota: e.target.value})}
              placeholder="Ingrese la nueva calificación"
            />
            
            <div className="modal-footer">
              <button onClick={() => setIsPopupOpen(false)}>
                Cancelar
              </button>
              <button onClick={() => handleUpdate(selectedGrade)}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;

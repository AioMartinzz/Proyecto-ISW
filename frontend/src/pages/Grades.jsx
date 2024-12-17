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
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    generalAverage: 0
  });

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
    const value = e.target.value;
    setFilterStudent(value);
  };

  const handleSelectionChange = useCallback(
    (selectedItems) => {
      setSelectedGrades(selectedItems);
      setSelectedGrade(selectedItems[0]);
    },
    [setSelectedGrade]
  );

  const filteredGrades = grades.filter(grade => {
    if (!filterStudent.trim()) return true;
    
    return (
      grade.estudiante_id?.toString().includes(filterStudent) ||
      grade.asignatura_id?.toString().includes(filterStudent) ||
      grade.grade_id?.toString().includes(filterStudent)
    );
  });

  const columns = [
    {
      title: 'Estudiante ID',
      field: 'estudiante_id',
      width: '25%',
      responsive: 0,
      formatter: function(cell) {
        return `<span class="id-cell">${cell.getValue()}</span>`;
      }
    },
    {
      title: 'Asignatura ID',
      field: 'asignatura_id',
      width: '25%',
      responsive: 0,
      formatter: function(cell) {
        return `<span class="id-cell">${cell.getValue()}</span>`;
      }
    },
    {
      title: 'Calificación',
      field: 'nota',
      width: '15%',
      responsive: 0,
      formatter: function(cell) {
        const value = cell.getValue();
        const colorClass = value < 4.0 ? 'grade-low' : '';
        return `<span class="grade-cell ${colorClass}">${value}</span>`;
      },
      hozAlign: "center"
    },
    {
      title: 'Fecha',
      field: 'fechacreacion',
      width: '20%',
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

  // Función para calcular estadísticas
  const calculateStats = useCallback(() => {
    if (!grades.length) return;

    // Obtener estudiantes y materias únicos
    const uniqueStudents = new Set(grades.map(grade => grade.estudiante_id));
    const uniqueSubjects = new Set(grades.map(grade => grade.asignatura_id));

    // Calcular promedio general
    const totalGrades = grades.reduce((sum, grade) => sum + Number(grade.nota), 0);
    const average = (totalGrades / grades.length).toFixed(1);

    setStats({
      totalStudents: uniqueStudents.size,
      totalSubjects: uniqueSubjects.size,
      generalAverage: average
    });
  }, [grades]);

  // Calcular estadísticas cuando cambian las calificaciones
  useEffect(() => {
    calculateStats();
  }, [grades, calculateStats]);

  if (loading) {
    return <div>Cargando calificaciones...</div>;
  }

  if (error) {
    return <div>Error al cargar calificaciones: {error}</div>;
  }

  return (
    <div className="main-container">
      <div className="header">
        <div className="header-text">
          <h1>Portal de Notas</h1>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-header">
            <i className="fa-solid fa-user"></i>
            <p className="stat-title">Total de Estudiantes</p>
          </div>
          <p className="stat-value">{stats.totalStudents}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <i className="fa-solid fa-book"></i>
            <p className="stat-title">Total de Materias</p>
          </div>
          <p className="stat-value">{stats.totalSubjects}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <i className="fa-solid fa-calculator"></i>
            <p className="stat-title">Promedio General</p>
          </div>
          <p className="stat-value">{stats.generalAverage}</p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="top-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nombre o materia..."
              value={filterStudent}
              onChange={handleFilterChange}
            />
          </div>
          <button
            className="register-button"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <i className="fas fa-plus"></i>
            Registrar Calificación
          </button>
        </div>
      {filteredGrades.length === 0 ? (
        <div className="no-results">No se encontraron resultados para la búsqueda</div>
      ) : (
        <div className="table-container">
          <GradesTable
            grades={filteredGrades}
            columns={columns}
          />
        </div>
      )}
      <div className="tabulator-footer">
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

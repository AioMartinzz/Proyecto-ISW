import React, { useState, useCallback, useEffect } from 'react';
import Search from '../components/Search';
import RegisterGrade from '../components/RegisterGrade';
import GradesTable from '../components/GradesTable';
import useGetGrades from '@hooks/grades/useGetGrades';
import useEditGrade from '@hooks/grades/useEditGrade';
import useDeleteGrade from '@hooks/grades/useDeleteGrade';
import useFilteredGrades from '../hooks/useFilteredGrades';
import '@styles/grades.css';
import { useAuth } from '@context/AuthContext';

const Grades = () => {
  const { grades = [], setGrades, loading, error } = useGetGrades(); // Añadimos manejo de errores
  const { user } = useAuth();
  console.log('Role from context:', user?.rol); // Debug log
  console.log('Full user:', user); // Debug log completo
  const filteredGrades = useFilteredGrades(grades, user);
  const [filterStudent, setFilterStudent] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    generalAverage: 0
  });

  const allowedRoles = ['profesor', 'administrador']; // Definir los roles permitidos igual que en main.jsx
  console.log('Current user role:', user?.rol); // Debug log
  
  const canAddGrades = allowedRoles.includes(user?.rol?.toLowerCase());

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
    e.preventDefault();
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

  const columns = [
    {
      title: 'Estudiante',
      field: 'nombre_estudiante',
      width: '25%',
      responsive: 0,
    },
    {
      title: 'Asignatura',
      field: 'nombre_asignatura',
      width: '25%',
      responsive: 0,
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
        return date.toLocaleString('es-CL', {
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
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleRegisterError = (error) => {
    setMessage({ text: `Error al registrar la calificación: ${error}`, type: 'error' });
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
              onSubmit={(e) => e.preventDefault()}
            />
          </div>
          {canAddGrades && (
            <button
              className="register-button"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              <i className="fas fa-plus"></i>
              Registrar Calificación
            </button>
          )}
        </div>
      {filteredGrades.length === 0 ? (
        <div className="no-results">No se encontraron resultados para la búsqueda</div>
      ) : (
        <div className="table-container">
          <GradesTable
            grades={filteredGrades}
            columns={columns}
            filter={filterStudent}
            dataToFilter={["nombre_estudiante", "nombre_asignatura"]}
          />
        </div>
      )}
      <div className="tabulator-footer">
      </div>

      {canAddGrades && (
        <RegisterGrade 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={handleRegisterSuccess}
          onError={handleRegisterError}
          asignaturaId={user?.rol === 'profesor' ? user?.asignatura_id : null}
        />
      )}

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

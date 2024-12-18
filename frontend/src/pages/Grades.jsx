import React, { useState, useCallback, useEffect } from 'react';
import RegisterGrade from '../components/RegisterGrade';
import GradesTable from '../components/GradesTable';
import useGetGrades from '@hooks/grades/useGetGrades';
import useEditGrade from '@hooks/grades/useEditGrade';
import useDeleteGrade from '@hooks/grades/useDeleteGrade';
import useFilteredGrades from '../hooks/useFilteredGrades';
import '@styles/grades.css';
import { useAuth } from '@context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Grades = () => {
  const { grades = [], setGrades, loading, error } = useGetGrades();
  const { user } = useAuth();
  const filteredGrades = useFilteredGrades(grades, user);
  const [filterStudent, setFilterStudent] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    generalAverage: 0
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    estudiante: '',
    asignatura: ''
  });

  const allowedRoles = ['profesor', 'administrador'];
  const canManageGrades = allowedRoles.includes(user?.rol?.toLowerCase());

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


  const baseColumns = [
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
    }
  ];

  const actionColumn = {
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
  };

  const columns = canManageGrades ? [...baseColumns, actionColumn] : baseColumns;

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

  const filterGradesByRole = useCallback((grades) => {
    if (!user || !grades) return [];
    // Filtrar notas por rol de usuario
    switch (user.rol?.toLowerCase()) {
      case 'apoderado':
        // solo las notas del estudiante asociado 
        return grades.filter(grade => grade.estudiante_id === user.estudiante_id);
      case 'profesor':
        // Ssolo las notas de su asignatura asociada
        return grades.filter(grade => grade.asignatura_id === user.asignatura_id);
      case 'administrador':
        // puede ver todas las notas
        return grades;
      default:
        return [];
    }
  }, [user]);

  const calculateStats = useCallback(() => {
    if (!grades.length) return;

    // Filtrar las notas por rol de usuario
    const filteredGrades = filterGradesByRole(grades);

    // caso apoderado
    if (user?.rol?.toLowerCase() === 'apoderado') {
      const uniqueSubjects = new Set(filteredGrades.map(grade => grade.nombre_asignatura));
      const generationGrades = grades.filter(grade => 
        filteredGrades[0]?.asignatura_id === grade.asignatura_id
      );
      
      const generationAverage = generationGrades.length 
        ? (generationGrades.reduce((sum, grade) => sum + Number(grade.nota), 0) / generationGrades.length).toFixed(1) 
        : 0;

      setStats({
        totalStudents: 0, // No se muestra 
        totalSubjects: uniqueSubjects.size,
        generalAverage: generationAverage // Cambia el nombre a promedio alumno
      });
      return;
    }

    // Otros roles que no sea apoderado 
    const uniqueStudents = new Set(filteredGrades.map(grade => grade.nombre_estudiante));
    const uniqueSubjects = new Set(filteredGrades.map(grade => grade.nombre_asignatura));
    const totalGrades = filteredGrades.reduce((sum, grade) => sum + Number(grade.nota), 0);
    const average = filteredGrades.length ? (totalGrades / filteredGrades.length).toFixed(1) : 0;

    setStats({
      totalStudents: uniqueStudents.size,
      totalSubjects: uniqueSubjects.size,
      generalAverage: average
    });
  }, [grades, filterGradesByRole, user]);
  // STATS
  useEffect(() => {
    calculateStats();
  }, [grades, calculateStats]);

  const uniqueStudents = Array.from(new Set(grades.map(grade => grade.nombre_estudiante)));
  const uniqueSubjects = Array.from(new Set(grades.map(grade => grade.nombre_asignatura)));

  const handleOpenReportModal = () => {
    setReportFilters({ estudiante: '', asignatura: '' });
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportFilterChange = (e) => {
    const { name, value } = e.target;
    setReportFilters(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Calificaciones', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    // Filtrar las notas en base a los filtros
    const filteredForReport = grades.filter(grade => {
      const matchesEstudiante = reportFilters.estudiante ? grade.nombre_estudiante === reportFilters.estudiante : true;
      const matchesAsignatura = reportFilters.asignatura ? grade.nombre_asignatura === reportFilters.asignatura : true;
      return matchesEstudiante && matchesAsignatura;
    });

    // Formato de la tabla con los encabezados
    const tableColumn = ["Estudiante", "Asignatura", "Calificación", "Fecha"];
    const tableRows = [];

    filteredForReport.forEach(grade => {
      const gradeData = [
        grade.nombre_estudiante,
        grade.nombre_asignatura,
        grade.nota,
        new Date(grade.fechacreacion).toLocaleString('es-CL')
      ];
      tableRows.push(gradeData);
    });
    //crear tabla en  PDF de manera automática usando la libreria
    doc.autoTable(tableColumn, tableRows, { startY: 30 });

    doc.save('reporte_calificaciones.pdf');
    setIsReportModalOpen(false);
  };

  if (loading) {
    return <div>Cargando calificaciones...</div>;
  }

  if (error) {
    return <div>Error al cargar calificaciones: {error}</div>;
  }

  // Verificar si existen calificaciones asociadas al usuario siendo este apoderado
  const noGrades = !grades?.length || grades === 'No hay calificaciones' || (Array.isArray(grades) && grades[1] === 'No hay calificaciones');

  if (user?.rol?.toLowerCase() === 'apoderado' && noGrades) {
    return (
      <div className="main-container">
        <div className="header">
          <div className="header-text">
            <h1>Portal de notas apoderados</h1>
          </div>
        </div>
        <div className="no-data-message">
          No hay calificaciones registradas para el estudiante.
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="header">
        <div className="header-text">
          <h1>
            {`Portal de notas ${ //Cambiar el header dependiendo del rol del usuario
              user?.rol?.toLowerCase() === 'administrador'
                ? 'administrador'
                : user?.rol?.toLowerCase() === 'profesor'
                ? 'profesores'
                : user?.rol?.toLowerCase() === 'apoderado'
                ? 'apoderados'
                : ''
            }`}
          </h1>
        </div>
      </div>

      <div className="stats-container">
        {user?.rol?.toLowerCase() !== 'apoderado' && (
          <div className="stat-card">
            <div className="stat-header">
              <i className="fa-solid fa-user"></i>
              <p className="stat-title">Total de Estudiantes</p>
            </div>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        )}

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
            <p className="stat-title">
              {user?.rol?.toLowerCase() === 'apoderado' ? 'Promedio alumno' : 'Promedio General'}
            </p>
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
        <div className="button-group">
          {canManageGrades && (
            <>
              <button
                className="register-button"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                <i className="fas fa-plus"></i>
                Registrar Calificación
              </button>
              <button
                className="report-button"
                onClick={handleOpenReportModal}
              >
                <i className="fas fa-file-pdf"></i>
                Generar Informe
              </button>
            </>
          )}
        </div>
      </div>
      {filteredGrades.length === 0 ? (
        <div className="no-results">
          No se encontraron resultados para la búsqueda
        </div>
      ) : (
        <div className="table-container">
          <GradesTable
            grades={filterGradesByRole(grades)}
            columns={columns}
            filter={filterStudent}
            dataToFilter={["nombre_estudiante", "nombre_asignatura"]}
          />
        </div>
      )}
      <div className="tabulator-footer">
      </div>

      {canManageGrades && (
        <RegisterGrade 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={handleRegisterSuccess}
          onError={handleRegisterError}
          user={user}
        />
      )}

      {isPopupOpen && ( //Modal modificar notas
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modificar Calificación</h2>
            
            <label className="grade-label">Nueva calificación:</label>
            <input
              type="number"
              min="1.0"
              max="7.0"
              step="0.1"
              value={selectedGrade?.nota || ''}
              onChange={(e) => setSelectedGrade({ ...selectedGrade, nota: e.target.value })}
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
      
      {isReportModalOpen && ( //Modal PDF
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Generar Informe</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="estudiante">Seleccionar Estudiante:</label>
                <select
                  name="estudiante"
                  id="estudiante"
                  value={reportFilters.estudiante}
                  onChange={handleReportFilterChange}
                >
                  <option value="">Todos</option>
                  {uniqueStudents.map((student, index) => (
                    <option key={index} value={student}>{student}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="asignatura">Seleccionar Asignatura:</label>
                <select
                  name="asignatura"
                  id="asignatura"
                  value={reportFilters.asignatura}
                  onChange={handleReportFilterChange}
                >
                  <option value="">Todos</option>
                  {uniqueSubjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleCloseReportModal}>
                  Cancelar
                </button>
                <button type="button" onClick={generatePDF}>
                  Generar PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;

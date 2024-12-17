import React, { useState, useEffect } from 'react';
import { registerGrade } from '../services/grade.service';
import axios from '../services/root.service';

const RegisterGrade = ({ isOpen, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    asignatura_id: '',
    nota: ''
  });
  const [errors, setErrors] = useState({});
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumnosResponse, asignaturasResponse] = await Promise.all([
          axios.get('/alumnos'),
          axios.get('/asignaturas')
        ]);

        const alumnosData = Array.isArray(alumnosResponse.data) ? alumnosResponse.data : 
                          (alumnosResponse.data?.data || []);
        
        const asignaturasData = Array.isArray(asignaturasResponse.data) ? asignaturasResponse.data : 
                               (asignaturasResponse.data?.data || []);

        console.log('Datos alumnos:', alumnosData);
        console.log('Datos asignaturas:', asignaturasData);

        setEstudiantes(alumnosData);
        setAsignaturas(asignaturasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        if (error.response?.status === 401) {
          onError('No autorizado. Por favor, inicie sesión nuevamente.');
        } else if (error.response?.status === 403) {
          onError('No tiene permisos para acceder a estos datos.');
        } else {
          onError('Error al cargar los datos necesarios');
        }
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.estudiante_id) {
      newErrors.estudiante_id = 'El ID del estudiante es requerido';
    }
    if (!formData.asignatura_id) {
      newErrors.asignatura_id = 'El ID de la asignatura es requerido';
    }
    if (!formData.nota) {
      newErrors.nota = 'La calificación es requerida';
    } else if (formData.nota < 1.0 || formData.nota > 7.0) {
      newErrors.nota = 'La calificación debe estar entre 1.0 y 7.0';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const [data, error] = await registerGrade(formData);
      if (error) {
        throw new Error(error);
      }
      onSuccess();
      onClose();
      setFormData({ estudiante_id: '', asignatura_id: '', nota: '' });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal-content">
        <h2>Registrar Nueva Calificación</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="estudiante_id">Estudiante:</label>
            <select
              name="estudiante_id"
              value={formData.estudiante_id}
              onChange={handleChange}
            >
              <option value="">Seleccione un estudiante</option>
              {estudiantes && estudiantes.map(estudiante => (
                <option key={estudiante.id} value={estudiante.id}>
                  {estudiante.nombreCompleto}
                </option>
              ))}
            </select>
            {errors.estudiante_id && (
              <span className="error-message">{errors.estudiante_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="asignatura_id">Asignatura:</label>
            <select
              name="asignatura_id"
              value={formData.asignatura_id}
              onChange={handleChange}
            >
              <option value="">Seleccione una asignatura</option>
              {asignaturas && asignaturas.map(asignatura => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </select>
            {errors.asignatura_id && (
              <span className="error-message">{errors.asignatura_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nota">Calificación:</label>
            <input
              type="number"
              id="nota"
              name="nota"
              step="0.1"
              min="1.0"
              max="7.0"
              value={formData.nota}
              onChange={handleChange}
              placeholder="Ingrese la calificación (1.0 - 7.0)"
            />
            {errors.nota && (
              <span className="error-message">{errors.nota}</span>
            )}
          </div>

          <div className="register-modal-footer">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterGrade;


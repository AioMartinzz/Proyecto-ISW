import React, { useState } from 'react';
import { registerGrade } from '../services/grade.service';

const RegisterGrade = ({ isOpen, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    asignatura_id: '',
    nota: ''
  });
  const [errors, setErrors] = useState({});

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
            <label htmlFor="estudiante_id">ID del Estudiante:</label>
            <input
              type="number"
              id="estudiante_id"
              name="estudiante_id"
              value={formData.estudiante_id}
              onChange={handleChange}
              placeholder="Ingrese el ID del estudiante"
            />
            {errors.estudiante_id && (
              <span className="error-message">{errors.estudiante_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="asignatura_id">ID de la Asignatura:</label>
            <input
              type="number"
              id="asignatura_id"
              name="asignatura_id"
              value={formData.asignatura_id}
              onChange={handleChange}
              placeholder="Ingrese el ID de la asignatura"
            />
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


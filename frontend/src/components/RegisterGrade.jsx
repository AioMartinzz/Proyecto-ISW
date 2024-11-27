import React, { useState } from 'react';
import { registerGrade } from '../services/grade.service';

const RegisterGrade = ({ onSuccess }) => {
    const [gradeData, setGradeData] = useState({
        estudiante_id: '',
        asignatura_id: '',
        nota: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setGradeData({
            ...gradeData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const [data, error] = await registerGrade({
                estudiante_id: parseInt(gradeData.estudiante_id),
                asignatura_id: parseInt(gradeData.asignatura_id),
                nota: parseFloat(gradeData.nota)
            });
            
            if (error) {
                setError(error.message);
            } else {
                setGradeData({ estudiante_id: '', asignatura_id: '', nota: '' });
                onSuccess?.();
            }
        } catch (err) {
            setError('Error al registrar la calificación');
            console.error(err);
        }
    };

    return (
        <div className="register-grade-form">
            <h2>Registrar Nueva Calificación</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="estudiante_id"
                        value={gradeData.estudiante_id}
                        placeholder="ID del Estudiante" 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="asignatura_id"
                        value={gradeData.asignatura_id}
                        placeholder="ID de la Asignatura" 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" 
                        name="nota"
                        value={gradeData.nota}
                        placeholder="Calificación" 
                        min="1" 
                        max="7" 
                        step="0.1" 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit">Registrar Calificación</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default RegisterGrade;


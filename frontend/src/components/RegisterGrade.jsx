
import React, { useState } from 'react';
import { registerGrade } from '../services/grade.service';

const RegisterGrade = () => {
    const [grade, setGrade] = useState({ estudiante_id: '', asignatura_id: '', grade: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setGrade({ ...grade, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [data, error] = await registerGrade(grade);
        if (error) {
            setError(error.message);
        } else {
            alert('Calificación registrada exitosamente');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" name="studentId" placeholder="ID del Estudiante" onChange={handleChange} required />
            <input type="number" name="subjectId" placeholder="ID de la Asignatura" onChange={handleChange} required />
            <input type="number" name="score" placeholder="Calificación" onChange={handleChange} required />
            <button type="submit">Registrar Calificación</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default RegisterGrade;


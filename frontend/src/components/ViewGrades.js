
import React, { useEffect, useState } from 'react';
import { getGrades } from '../services/gradeService';

const ViewGrades = () => {
    const [studentId, setStudentId] = useState('');
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState(null);

    const handleFetchGrades = async () => {
        const [data, error] = await getGrades(studentId);
        if (error) {
            setError(error);
        } else {
            setGrades(data);
        }
    };

    return (
        <div>
            <h2>Consultar Calificaciones</h2>
            <input type="number" placeholder="ID del Estudiante" onChange={(e) => setStudentId(e.target.value)} />
            <button onClick={handleFetchGrades}>Consultar</button>
            {error && <p>{error}</p>}
            <ul>
                {grades.map((grade) => (
                    <li key={grade.id}>
                        Asignatura ID: {grade.subjectId}, Calificación: {grade.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewGrades;


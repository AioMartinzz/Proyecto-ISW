import React from 'react'
import './Home.css'

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Sistema Integrado de Gestión Académica</h1>
            </header>
            <div className="home-features">
                <div className="feature-card">
                    <div className="feature-card-content">
                        <i className="fas fa-clipboard-list"></i>
                        <h2>Portal Anotaciones</h2>
                        <p>Digitalizacion de anotaciones.</p>   
                        <p>Descripcion de las anotaciones.</p>

                    </div>
                </div>
                <div className="feature-card">
                    <div className="feature-card-content">
                        <i className="fas fa-calendar-check"></i>
                        <h2>Portal de Asistencia</h2>
                        <p>Digitalización de la asistencia.</p>
                        <p>Generación de informes de asistencia.</p>
                        <p>Envío de aviso por correo electrónico.</p>
                    </div>
                </div>
                <div className="feature-card">
                    <div className="feature-card-content">
                        <i className="fa-solid fa-calculator"></i>
                        <h2>Portal de Notas</h2>
                        <p>Digitalización de las notas de los estudiantes.</p>
                        <p>Estadisticas varias.</p>
                        <p>Generación de reportes de notas en PDF.</p>
                        <p>Modificación de notas.</p> 
                    </div>
                </div>
            </div>
            <footer className="home-footer">
                <p>
                    © 2024 Ingeniería de Software. Todos los derechos
                    reservados.
                </p>
            </footer>
        </div>
    )
}

export default Home

import React from 'react'
import './Home.css'

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Bienvenido al Sistema Integrado de Gestión Académica</h1>
                <p>
                    Explora nuestras funcionalidades y comienza a usar la
                    aplicación.
                </p>
            </header>
            <div className="home-features">
                <div className="feature-card">
                    <div className="feature-card-content">
                        <h2>Registro de Usuarios</h2>
                        <p>Descripción breve de la funcionalidad 1.</p>
                    </div>
                </div>
                <div className="feature-card">
                    <div className="feature-card-content">
                        <h2>Portal de Asistencia 2</h2>
                        <p>Digitalización de la asistencia.</p>
                        <p>Generación de informes de asistencia.</p>
                        <p>Envío de aviso por correo electrónico.</p>
                    </div>
                </div>
                <div className="feature-card">
                    <div className="feature-card-content">
                        <h2>Portal de Notas</h2>
                        <p>Digitalización de las notas de los estudiantes.</p>
                        <p>Estadisticas de las notas.</p>
                       
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

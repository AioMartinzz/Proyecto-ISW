import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenido a la Aplicación</h1>
        <p>Explora nuestras funcionalidades y comienza a usar la aplicación.</p>
      </header>
      <section className="home-features">
        <div className="feature">
          <h2>Funcionalidad 1</h2>
          <p>Descripción breve de la funcionalidad 1.</p>
        </div>
        <div className="feature">
          <h2>Funcionalidad 2</h2>
          <p>Descripción breve de la funcionalidad 2.</p>
        </div>
        <div className="feature">
          <h2>Funcionalidad 3</h2>
          <p>Descripción breve de la funcionalidad 3.</p>
        </div>
      </section>
      <footer className="home-footer">
        <p>© 2024 Ingeniería de Software. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;

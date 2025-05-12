import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const TennisWorld = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  
  useEffect(() => {
    // Inicializar Three.js
    const width = mountRef.current.clientWidth;
    const height = 300;
    
    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f8ff);
    
    // Crear cámara
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Crear renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    // Crear iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Crear pelota de tenis
    const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xccff00,
      roughness: 0.8,
      metalness: 0.2
    });
    const tennisBall = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // Agregar líneas a la pelota de tenis (las costuras características)
    const curveGeometry = new THREE.TorusGeometry(1.02, 0.02, 16, 100);
    const curveMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const curve = new THREE.Mesh(curveGeometry, curveMaterial);
    curve.rotation.x = Math.PI / 2;
    
    const curve2 = curve.clone();
    curve2.rotation.x = 0;
    curve2.rotation.y = Math.PI / 2;
    
    const ballGroup = new THREE.Group();
    ballGroup.add(tennisBall);
    ballGroup.add(curve);
    ballGroup.add(curve2);
    
    scene.add(ballGroup);
    
    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      
      ballGroup.rotation.y += 0.01;
      ballGroup.rotation.x += 0.005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Manejar el cambio de tamaño de ventana
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Guardar referencia a la escena
    sceneRef.current = { scene, camera, renderer, ballGroup };
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  // Datos del tenis
  const tennisData = {
    jugadores: [
      { nombre: 'Carlos Alcaraz', ranking: 1, pais: 'España', edad: 21, titulos: 15 },
      { nombre: 'Jannik Sinner', ranking: 2, pais: 'Italia', edad: 22, titulos: 12 },
      { nombre: 'Novak Djokovic', ranking: 3, pais: 'Serbia', edad: 37, titulos: 98 },
      { nombre: 'Alexander Zverev', ranking: 4, pais: 'Alemania', edad: 27, titulos: 24 },
      { nombre: 'Daniil Medvedev', ranking: 5, pais: 'Rusia', edad: 29, titulos: 20 }
    ],
    campeonatos: [
      { nombre: 'Roland Garros', fecha: 'Mayo 25 - Junio 8, 2025', superficie: 'Tierra batida', ciudad: 'París', pais: 'Francia' },
      { nombre: 'Wimbledon', fecha: 'Junio 30 - Julio 13, 2025', superficie: 'Hierba', ciudad: 'Londres', pais: 'Reino Unido' },
      { nombre: 'US Open', fecha: 'Agosto 25 - Septiembre 7, 2025', superficie: 'Dura', ciudad: 'Nueva York', pais: 'Estados Unidos' },
      { nombre: 'Australian Open', fecha: 'Enero 13 - 26, 2025', superficie: 'Dura', ciudad: 'Melbourne', pais: 'Australia' },
      { nombre: 'ATP Finals', fecha: 'Noviembre 10 - 17, 2025', superficie: 'Dura (Indoor)', ciudad: 'Turín', pais: 'Italia' }
    ],
    proximos: [
      { nombre: 'Masters 1000 de Madrid', fecha: 'Mayo 15 - 21, 2025', superficie: 'Tierra batida' },
      { nombre: 'Masters 1000 de Roma', fecha: 'Mayo 22 - 29, 2025', superficie: 'Tierra batida' },
      { nombre: 'Roland Garros', fecha: 'Mayo 25 - Junio 8, 2025', superficie: 'Tierra batida' },
      { nombre: 'ATP 500 de Queen\'s', fecha: 'Junio 15 - 21, 2025', superficie: 'Hierba' },
      { nombre: 'ATP 500 de Halle', fecha: 'Junio 15 - 21, 2025', superficie: 'Hierba' }
    ]
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <nav className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Mundo del Tenis</h1>
            <div className="flex space-x-4">
              <button 
                className={`px-3 py-2 rounded-md ${activeSection === 'inicio' ? 'bg-green-900' : 'hover:bg-green-600'}`}
                onClick={() => setActiveSection('inicio')}
              >
                Inicio
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${activeSection === 'jugadores' ? 'bg-green-900' : 'hover:bg-green-600'}`}
                onClick={() => setActiveSection('jugadores')}
              >
                Jugadores
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${activeSection === 'campeonatos' ? 'bg-green-900' : 'hover:bg-green-600'}`}
                onClick={() => setActiveSection('campeonatos')}
              >
                Campeonatos
              </button>
              <button 
                className={`px-3 py-2 rounded-md ${activeSection === 'proximos' ? 'bg-green-900' : 'hover:bg-green-600'}`}
                onClick={() => setActiveSection('proximos')}
              >
                Próximos Partidos
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Visualización 3D con Three.js */}
      <div className="container mx-auto px-4 py-6">
        <div 
          ref={mountRef} 
          className="w-full h-64 bg-gray-100 rounded-lg shadow-md overflow-hidden mb-8"
        />
      </div>
      
      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {activeSection === 'inicio' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-green-800">Bienvenido al Mundo del Tenis</h2>
            <p className="text-lg mb-4">
              El tenis es uno de los deportes más elegantes y estratégicos del mundo. Combina fuerza, 
              velocidad, resistencia y habilidad mental para crear un espectáculo único.
            </p>
            <p className="text-lg mb-4">
              En nuestra página, encontrarás información actualizada sobre los mejores jugadores del circuito, 
              los torneos más importantes y los próximos partidos que no te puedes perder.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Grand Slams</h3>
                <p>
                  Los cuatro torneos más prestigiosos del tenis son los Grand Slams: Australian Open, 
                  Roland Garros, Wimbledon y US Open. Ganar estos torneos representa el máximo logro para un tenista.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Superficies de Juego</h3>
                <p>
                  El tenis se juega en diferentes superficies: tierra batida (arcilla), hierba, dura (cemento) 
                  y carpeta (indoor). Cada superficie favorece a diferentes estilos de juego y requiere adaptaciones técnicas.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'jugadores' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-green-800">Top Jugadores</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Ranking</th>
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-left">País</th>
                    <th className="py-3 px-4 text-left">Edad</th>
                    <th className="py-3 px-4 text-left">Títulos</th>
                  </tr>
                </thead>
                <tbody>
                  {tennisData.jugadores.map((jugador, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 border-b">{jugador.ranking}</td>
                      <td className="py-3 px-4 border-b font-medium">{jugador.nombre}</td>
                      <td className="py-3 px-4 border-b">{jugador.pais}</td>
                      <td className="py-3 px-4 border-b">{jugador.edad}</td>
                      <td className="py-3 px-4 border-b">{jugador.titulos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-gray-600">
              *Ranking actualizado al 10 de mayo de 2025
            </p>
          </div>
        )}
        
        {activeSection === 'campeonatos' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-green-800">Grandes Campeonatos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tennisData.campeonatos.map((torneo, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-green-700">{torneo.nombre}</h3>
                  <div className="mt-3 text-gray-700">
                    <p><strong>Fecha:</strong> {torneo.fecha}</p>
                    <p><strong>Superficie:</strong> {torneo.superficie}</p>
                    <p><strong>Ubicación:</strong> {torneo.ciudad}, {torneo.pais}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeSection === 'proximos' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-green-800">Próximos Torneos</h2>
            <div className="space-y-4">
              {tennisData.proximos.map((evento, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">{evento.nombre}</h3>
                    <p className="text-gray-600">{evento.fecha}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {evento.superficie}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">¡Próximo Gran Evento!</h3>
              <p className="mt-2">
                No te pierdas el inicio de Roland Garros 2025, el segundo Grand Slam del año, 
                que comenzará el 25 de mayo en París. ¿Quién se llevará la corona de la tierra batida?
              </p>
            </div>
          </div>
        )}
      </main>
      
      {/* Pie de página */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Mundo del Tenis</h3>
              <p className="text-gray-400">Tu portal de información tenística</p>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Mundo del Tenis. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TennisWorld;
1.- Cronometro por etapas (/components/Cronometro)
    *Iniciar el cronometro cuando el equipo inicie sesion
    *Reiniciar el cronometro
    *Asociar el cronometro por usuario
    *Guardar el tiempo total

2.- Sistema de preguntas (pages/preguntas.jsx)
    *Crear la base de datos de preguntas (data/preguntas.json)
        -Pregunta
        -4 opciones
        -Justificacion
    *Mostrar una pregunta a la vez(components/pregunta.jsx)
    *Mostrar boton de siguiente
    *Contador de preguntas respondidas correctamente(components/etapa.jsx)

3.- Interfaz de login(pages/home.jsx)
    *Crear pantalla de login
    *Detectar tipo de usuario desde el servidor (components/login.jsx)
        -En caso de equipo, mandar a la interfaz de preguntas
        -En caso de admin, mandarlo a admin xd

4.- Interfaz para actividad fisica
    *Mostrar que actividad corresponde junto con instrucciones o acertijo (components/actividadfisica.jsx)
    *Boton de actividad terminada
    *Termino del cronometro por etapa

5.- Interfaz de administrador (pages/admin.jsx)
    *Ver tabla de tiempos por equipo 
    *Equipo con menores respuestas incorrectas
    *Boton para dejar los tiempos en blanco

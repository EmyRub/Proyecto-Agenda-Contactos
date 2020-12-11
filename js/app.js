const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody'),
    inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    // Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar botón
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    // Buscador
    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();

}

function leerFormulario(e) {

    e.preventDefault();

    // Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');

    } else {
        // Pasa la validación, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append("nombre", nombre);
        infoContacto.append("empresa", empresa);
        infoContacto.append("telefono", telefono);
        infoContacto.append("accion", accion);

        // console.log(...infoContacto);

        if (accion === 'crear') {
            //Crear un nuevo contacto
            insertarBD(infoContacto);
        } else {
            // Editar contacto
            // Leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

/** Inserta en la base de datos vía Ajax */
function insertarBD(datos) {
    //llamado a ajax

    // Crear el objeto
    const xhr = new XMLHttpRequest();

    //Abrir la conexión, POST mandar a la db
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // Pasar los datos, onload función de JS
    xhr.onload = function() {
        if (this.status === 200) {
            //JSON.parse convierte el string de json en objeto de JS 
            //y debe estar escrito en json format
            console.log(JSON.parse(xhr.responseText));

            // Leemos respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);

            // Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = ` 
               <td>${respuesta.datos.nombre}</td> 
               <td>${respuesta.datos.empresa}</td> 
               <td>${respuesta.datos.telefono}</td>             
            `;

            //Crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            //Crear el icono de Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            //Crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar); //<i> hijo de <a>
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            // Resetear el formulario
            document.querySelector('form').reset();

            // Mostrar la notificación
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

            // Actualizar el número
            numeroContactos();
        }
    }

    // enviar los datos
    xhr.send(datos);
}

function actualizarRegistro(datos) {
    // Crear el objeto
    const xhr = new XMLHttpRequest();

    // Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // Leer la respuesta
    xhr.onload = function() {
        if (this.status === 200) {
            const respuesta = JSON.parse(xhr.responseText);

            if (respuesta.respuesta === 'correcto') {
                // mostrar notificación de Correcto
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
            } else {
                // Hubo un error
                mostrarNotificacion('Hubo un error...', 'error');
            }
            // Después de 3 segundos redireccionar
            setTimeout(() => {
                window.location.href = 'index.php'
            }, 3500);
        }
    }

    // Enviar la petición
    xhr.send(datos);
}

// Eliminar el contacto
function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        // tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');

        //console.log(id);
        // preguntar al usuario si están seguros
        const respuesta = confirm('Estás Seguro(a)?')

        if (respuesta) {
            // Llamado a Ajax
            // Crear el objeto
            const xhr = new XMLHttpRequest();

            // Abrir la conexión
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            // Leer la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);
                    console.log(resultado);

                    if (resultado.respuesta === 'correcto') {
                        // Eliminar el registro del DOM
                        console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();
                        // Mostrar Notificación
                        mostrarNotificacion('Contacto eliminado', 'correcto');

                        // Actualizar el número
                        numeroContactos();
                    } else {
                        // Mostramos una notificación
                        mostrarNotificacion('Hubo un error...', 'error');
                    }
                }
            }

            // Enviar la petición
            xhr.send();

        }

    }
}

// Notificación en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y Mostrar la notificación
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);

        }, 3000);
    }, 1000);
}

// Buscador de Registro
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        registro.style.display = 'none';

        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
        }
        numeroContactos();
    })
}

function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });
    // console.log(total);
    contenedorNumero.textContent = total;
}
// Declaración de variables 
let funcionariosArr = [];
const btnAñadir = document.getElementById('btn-añadir');
let idFuncionario = 0;
let verificador = 0

let selectMuni = document.querySelector('#muni');
const selectDepa = document.querySelector('#depa');
const selectContrato = document.querySelector('#tipo-contrato');

function cargarOpciones() {
// Menu Contrato
  fetch("http://164.90.186.2:2707/api/contrato")
  .then(respuesta => respuesta.json())
  .then(datos =>{
    datos.forEach(contrato => {
      const tipoContrato = document.createElement('option');
      tipoContrato.value = contrato.id_contrato;
      tipoContrato.textContent = contrato.tipo_contrato;
      selectContrato.appendChild(tipoContrato);
    });
  });

// Menú municipio
  fetch("http://164.90.186.2:2707/api/municipio")
  .then(response => response.json())
  .then(data => {
    data.forEach(municipio => {
      const option = document.createElement("option");
      option.value = municipio.id_muni;
      option.textContent = `${municipio.nombre_muni}`;
      selectMuni.appendChild(option);
    });
  });

selectMuni.addEventListener("change",capturarIdMuni);

// Menu Departamento
  function capturarIdMuni() {
    const opcionMuniId = parseInt(selectMuni.value);
    selectDepa.innerHTML='';

    fetch("http://164.90.186.2:2707/api/departamento")
    .then(respuesta => respuesta.json())
    .then(datos => {
      const depaMuni = datos.filter(departamento => departamento.id_muni === opcionMuniId);
      depaMuni.forEach(departamento => {
        const opcionesDepa = document.createElement('option');
        opcionesDepa.value = departamento.id_departamento;
        opcionesDepa.textContent = `${departamento.nombre_departamento}`;
        selectDepa.appendChild(opcionesDepa);
      });
    });
  }
}

function listarFuncionarios(){

  // limpiamos la tabla y cargamos los menu de opciones
  document.querySelector('.datos').innerHTML = '';
  cargarOpciones();

  // query para traer información de la API 
  var myHeaders = new Headers();
  myHeaders.append("Content-Type","application/json");
  var raw = JSON.stringify({"query":
    `SELECT
    funcionarios.id_funcionario,
    funcionarios.rut,
    funcionarios.dv_rut,
    funcionarios.nombre,
    funcionarios.ape_paterno,
    funcionarios.ape_materno,
    funcionarios.contacto,
    funcionarios.email,
    (SELECT nombre_departamento FROM departamento WHERE departamento.id_departamento = funcionarios.id_departamento) AS nombre_departamento,
    (SELECT nombre_muni FROM municipio WHERE municipio.id_muni = (SELECT id_muni FROM departamento WHERE departamento.id_departamento = funcionarios.id_departamento)) AS nombre_muni,
    (SELECT tipo_contrato FROM contrato WHERE contrato.id_contrato = funcionarios.id_contrato) AS tipo_contrato,
    funcionarios.sueldo
  FROM
    funcionarios
  WHERE
    funcionarios.id_departamento = (SELECT id_departamento FROM departamento WHERE departamento.id_departamento = funcionarios.id_departamento)
    AND funcionarios.id_contrato = (SELECT id_contrato FROM contrato WHERE contrato.id_contrato = funcionarios.id_contrato)
  LIMIT 0, 1000;
  `
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://164.90.186.2:2707/dynamic/funcionarios", requestOptions)
    .then(response => response.json())
    .then((json) => json.forEach(mostrarDatos))
    .then(result => console.log(result))
    .catch(error => console.log('error',error));
};

function mostrarDatos(elemento, i, arr) {
  funcionariosArr.push(elemento);
  arr[i] = document.querySelector('.datos').innerHTML += 
        `
        <tr>
            <td>${elemento.rut +'-'+ elemento.dv_rut}</td>
            <td>${elemento.nombre}</td>
            <td>${elemento.ape_paterno +' '+ elemento.ape_materno}</td>
            <td>${elemento.contacto}</td>
            <td>${elemento.email}</td>
            <td>${elemento.nombre_departamento}</td>
            <td>${elemento.nombre_muni}</td>
            <td>${elemento.tipo_contrato}</td>
            <td>${'$' + elemento.sueldo}</td>
            <td class= "btns-tabla">
                <div>
                    <button type="button" class="btn btn-primary btn-sm" onclick=editarFuncionario(${elemento.id_funcionario})>
                      <span class="material-symbols-outlined logo-acciones">border_color</span>
                    </button>
                </div>
                <div>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdropp" onclick="asignarId(${elemento.id_funcionario});">
                      <span class="material-symbols-outlined logo-acciones">delete</span>
                    </button>
                </div>
            </td>   
        </tr>
        `
};

// ----AÑADIR----  
function agregar(){
  // limpiarFormulario();

  const rut = document.getElementById('rut').value;
  const dv = document.getElementById('dv').value;
  const nombre = document.getElementById('nombre').value;
  const apePat = document.getElementById('ape-pat').value;
  const apeMat = document.getElementById('ape-mat').value;
  const fono = document.getElementById('telefono').value;
  const mail = document.getElementById('mail').value;
  const sueldo = document.getElementById('sueldo').value;

  if (!rut || !dv || !nombre || !apePat || !apeMat || !fono || !mail || !sueldo) {
    alert('Faltan campos por completar');
    return;
  }
  // validarCampos();
  // validarRut(rut);
  // if (verificador == dv){
  //   return true;
  // } else {
  //   alert('El rut ingresado no es valido');
  // }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    'rut': parseInt(rut),
    'dv_rut': parseInt(dv),
    'nombre': nombre,
    'ape_paterno': apePat,
    'ape_materno': apeMat,
    'contacto': parseInt(fono),
    'email': mail,
    'id_departamento': parseInt(selectDepa.value), 
    'id_contrato': parseInt(selectContrato.value),
    'sueldo': parseInt(sueldo)
  });

    var options = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  }

  // btnAñadir.addEventListener('click',validarCampos);

  fetch("http://164.90.186.2:2707/api/funcionarios", options)
  .then(response => {
      if(response.status == 200){
          alert('Se agrego correctamente...');
          listarFuncionarios();
      }else{
          alert('Error al agregar los datos...');
      }
      })
  .then(response => console.log(response))
  .catch(err => console.error(err));
}

function editarFuncionario(id){
  let funcionarios = {};
  funcionariosArr.filter(elemento => {
    if(elemento.id_funcionario == id){
      funcionarios = elemento
      idFuncionarios = id;
    }
    });
    console.log(funcionarios);

    document.getElementById('rut2').value = funcionarios.rut;
    document.getElementById('dv2').value = funcionarios.dv_rut;
    document.getElementById('nombre2').value = funcionarios.nombre;
    document.getElementById('ape-pat2').value = funcionarios.ape_paterno;
    document.getElementById('ape-mat2').value = funcionarios.ape_materno;
    document.getElementById('telefono2').value = funcionarios.contacto;
    document.getElementById('mail2').value = funcionarios.email;
    document.getElementById('sueldo2').value = funcionarios.sueldo;
    document.querySelector('#muni2').value = 1;
    document.querySelector('#depa2').selectedIndex = funcionarios.id_departamento;
    document.querySelector('#tipo-contrato2').value = funcionarios.id_contrato;

    abrirModal();
  };

function actualizar(id) {

  const rut = document.getElementById('rut2').value;
  const dv = document.getElementById('dv2').value;
  const nombre = document.getElementById('nombre2').value;
  const apePat = document.getElementById('ape-pat2').value;
  const apeMat = document.getElementById('ape-mat2').value;
  const fono = document.getElementById('telefono2').value;
  const mail = document.getElementById('mail2').value;
  const sueldo = document.getElementById('sueldo2').value;

  if (!rut || !dv || !nombre || !apePat || !apeMat || !fono || !mail || !sueldo) {
    alert('Faltan campos por completar');
    return;
  }

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let raw = JSON.stringify({
  'rut': parseInt(rut),
  'dv_rut': parseInt(dv),
  'nombre': nombre,
  'ape_paterno': apePat,
  'ape_materno': apeMat,
  'contacto': parseInt(fono),
  'email': mail,
  'id_departamento': parseInt(selectDepa.value), 
  'id_contrato': parseInt(selectContrato.value),
  'sueldo': parseInt(sueldo)
});

var options = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
}

fetch("http://164.90.186.2:2707/api/funcionarios"+ id, options)
.then(response => {
    if(response.status == 200){
        alert('Se actualizo correctamente...');
        listarFuncionarios();
    }else{
        alert('Error al actualizar los datos...');
    }
    })
.then(response => console.log(response))
.catch(err => console.error(err));
}

function eliminar(id){
  var options = {
      method: 'DELETE',
      redirect: 'follow'
  }
      
  fetch('http://164.90.186.2:2707/api/funcionarios/'+ id, options)
  .then(response => {
  if(response.status == 200){
      alert('Se elimino correctamente...');
      listarFuncionarios();
  }else{
      alert('Error al eliminar los datos...');
  }
  })
  .then(response => console.log(response))
  .catch(err => console.error(err));
}

  

  function abrirModal() {
    var modalElement = document.querySelector('.editar');
    var modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

function asignarId(id) {
  idFuncionario = id;
}

function limpiarFormulario() {
  document.getElementById('rut').value = '';
  document.getElementById('dv').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('ape-pat').value = '';
  document.getElementById('ape-mat').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('mail').value = '';
  document.getElementById('muni').selectedIndex = 0;
  document.getElementById('depa').selectedIndex = 0;
  document.getElementById('tipo-contrato').selectedIndex = 0;
  document.getElementById('sueldo').value = '';
}

function validarCampos() {
  const rut = document.getElementById('rut').value;
  const dv = document.getElementById('dv').value;
  const nombre = document.getElementById('nombre').value;
  const apePat = document.getElementById('ape-pat').value;
  const apeMat = document.getElementById('ape-mat').value;
  const fono = document.getElementById('telefono').value;
  const mail = document.getElementById('mail').value;
  const sueldo = document.getElementById('sueldo').value;

  if (!rut || !dv || !nombre || !apePat || !apeMat || !fono || !mail || !sueldo) {
    alert("Por favor, complete todos los campos.");
    return false;
  }
  return true;
};

function validarRut(rut) {
  const rutSinDV = rut.toString().slice(0, -1).replace(/\./g, '');
  const rutRevertido = rutSinDV.split('').reverse();

  let suma = 0;
  let multiplicador = 2;

  for (let i = 0; i < rutRevertido.length; i++) {
    suma += rutRevertido[i] * multiplicador;
    multiplicador++;

    if (multiplicador > 7) {
      multiplicador = 2;
    }
  }

  const resto = suma % 11;

  let digitoVerificador = 11 - resto;

  if (digitoVerificador === 11) {
    digitoVerificador = 0;
  } else if (digitoVerificador === 10) {
    digitoVerificador = 'K';
  }

  console.log(digitoVerificador);
  verificador = digitoVerificador;;
}


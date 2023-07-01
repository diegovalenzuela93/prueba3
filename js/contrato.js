let tipoArr = [];
let idAct = 0;

function contrato(){
    document.querySelector('.datos').innerHTML = '';
    const options = {method: 'GET'};

    fetch('http://164.90.186.2:2707/api/contrato', options)
    .then(response => response.json())
    .then((json)=>json.forEach((elemento, i, arr) => { 
        tipoArr.push(elemento)   ;
        arr[i] = document.querySelector('.datos').innerHTML += 
        `            
        <tr>
            <td>${elemento.id_contrato}</td>
            <td>${elemento.tipo_contrato}</td>
            <td class= "btns-tabla">
                <div>
                    <button type="button" class="btn btn-primary btn-sm" onclick=editarFuncionario(${elemento.id_contrato})>
                      <span class="material-symbols-outlined logo-acciones">border_color</span>
                    </button>
                </div>
                <div>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdropp" onclick="asignarId(${elemento.id_contrato});">
                      <span class="material-symbols-outlined logo-acciones">delete</span>
                    </button>
                </div>
            </td>   
        </tr>
        ` 
        }
    ))
    .then(response => console.log(response))
    .catch(err => console.error(err))
}


// ----AÑADIR----  
function agregar(){
  const tipoContrato = document.getElementById('tipo-contrato').value;

  validarCampos();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    'tipo_contrato': tipoContrato,
  });

    var options = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  }

  fetch("http://164.90.186.2:2707/api/contrato", options)
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
  let contrato = {};
  tipoArr.filter(elemento => {
    if(elemento.id_contrato == id){
      contrato = elemento
      idAct = id
    }
    });

    console.log(contrato)

    document.getElementById('tipo-contrato').value = contrato.tipo_contrato;
    abrirModal();
  };

function actualizar(id) {

    const tipoContrato = document.getElementById('tipo-contrato').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
    'tipo_contrato': tipoContrato,
});

var options = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
}

fetch("http://164.90.186.2:2707/api/contrato/" + id, options)
.then(response => {
    if(response.status == 200){
        alert('Se actualizo correctamente...');
        contrato();
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
      
  fetch('http://164.90.186.2:2707/api/contrato/'+ id, options)
  .then(response => {
  if(response.status == 200){
      alert('Se elimino correctamente...');
      contrato();
  }else{
      alert('Error al eliminar los datos...');
  }
  })
  .then(response => console.log(response))
  .catch(err => console.error(err));
}

  

  function abrirModal() {
    var modalElement = document.querySelector('.edit');
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

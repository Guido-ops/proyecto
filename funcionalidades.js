const formularioJS = document.getElementById("Formularios");

formularioJS.addEventListener("submit", function(event){
    
    event.preventDefault();
    console.log("Boton funcionando");

    const nombre = document.getElementById("nombreI").value.trim();
    const apellido = document.getElementById("apellidoI").value.trim();
    const correo = document.getElementById("correoI").value.trim();
    const telefono = document.getElementById("telefonoI").value.trim();
    const direccion = document.getElementById("direccionI").value.trim();
    const pais = document.getElementById("paisSelect").value.trim();
    const contraseña = document.getElementById("Password").value;
    const confContraseña = document.getElementById("ConfPassword").value;

    const usuario = {nombre, apellido, contraseña, confContraseña, correo, telefono, direccion, pais};
    
    if(!validarInput(usuario)){
        return;
    }

    if(!validarContraseña(usuario)){
        return;
    }
    
    console.log("Nombre: " + nombre);
    console.log("Apellido: " + apellido);
    console.log("Contraseña: " + contraseña);
    console.log("Correo: " + correo);
    console.log("Telefono: " + telefono);
    console.log("Direccion: " + direccion);
    console.log("Pais: " + pais);
    
    console.log("Usuario creado: ", usuario);

    console.log("Nombre tiene: " + nombre.length + " caracteres");

    localStorage.setItem("usuarioLocalStorage", JSON.stringify(usuario));

    window.location = "tabla.html";
    
});

function validarInput(usuario) {
   if (usuario.nombre === "" || usuario.apellido === "" || usuario.correo === "" || usuario.telefono === "" || usuario.direccion === "" || usuario.pais === "") {
        alert("Los campos no pueden estar vacíos");
        return false;
    }
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!correoRegex.test(usuario.correo)){
        alert("Ingrese un correo válido");
        return false;
    }
    const soloDigitos = /^\d+$/;
    if(!soloDigitos.test(usuario.telefono)){
        alert("El teléfono solo puede contener números");
        return false;
    }
    if((usuario.pais === "CL" || usuario.pais === "ES") && usuario.telefono.length !== 9){
        alert("El telefono debe tener 9 digitos");
        return false;
    }
    if((usuario.pais === "MX" || usuario.pais === "US" || usuario.pais === "CA" || usuario.pais === "AR") && usuario.telefono.length !== 10){
        alert("El teléfono debe tener 10 dígitos");
        return false;
    }
    if(usuario.nombre.toLowerCase() === usuario.apellido.toLowerCase()){
        alert("El nombre y el apellido no pueden ser iguales");
        return false;
    }
    if((usuario.nombre.length  > 20|| usuario.apellido.length > 20)  ){
        alert("El nombre y El apellido no pueden tener más de 20 caracteres")
        return false;
    }
    return true;
}

function validarContraseña(usuario){
    const largo = usuario.contraseña.length >= 8;
    const mayuscula = /[A-Z]/.test(usuario.contraseña);
    const minuscula = /[a-z]/.test(usuario.contraseña); 
    const numero = /[0-9]/.test(usuario.contraseña);
    const especial = /[^A-Za-z0-9]/.test(usuario.contraseña);
    const coinciden = usuario.contraseña === usuario.confContraseña && usuario.contraseña !== "";

    const esValida = largo && mayuscula && minuscula && numero && especial && coinciden;

    if(!esValida){
        if(!largo){alert("Minimo 8 Caracteres");}
        else if(!mayuscula){alert("Debe tener al menos 1 caracter en mayuscula");} 
        else if(!minuscula){alert("Debe tener al menos 1 caracter en minuscula");}
        else if(!numero){alert("Debe tener al menos 1 caracter numerico");}
        else if(!especial){alert("Debe tener al menos 1 caracter especial");}
        else if(!coinciden){alert("Las contraseñas no coiciden");}
        return false;
    }return true; 
 
}

const usuarioBDD = {
        correo: "Guidoberto@gmail.com",
        password: "Guidoberto1."
    };

const loginUsuario = document.getElementById("Login");

loginUsuario.addEventListener("submit", function(event){
    event.preventDefault()
    console.log("Boton Funcionando");

    const correo = document.getElementById("correo2").value.trim();
    const contraseña = document.getElementById("contra").value;

    const usuario = {correo, contraseña}

    if(!validarUsuario(usuario)){
        return;
    }
    
    console.log("correo: " + correo);
    console.log("contraseña: " + contraseña);

});

function validarUsuario(usuario){

    if(usuario.correo === usuarioBDD.correo && usuario.contraseña === usuarioBDD.password){
        alert("Usuario Logeado");
        return true;
        
    } else{
        alert("Correo o contraseña incorrectos"); 
        return false;
    }
}

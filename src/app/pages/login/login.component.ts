import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme = false;

  constructor(private auth:  AuthService,
              private router: Router) { }

  ngOnInit(): void {

    if(localStorage.getItem('email')){
        this.usuario.email = localStorage.getItem('email');
        this.recordarme = true;
    }
  }


  login(loginFormulario: NgForm){

    if(!loginFormulario.valid) return;

    // console.log(this.usuario);
    // console.log(loginFormulario);

    // Alerta de carga
    // allowOutsideClick: false -> evita que se cierre el modal cuando se hace click afuera, por defecto es:  true
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere por favor...'
    });
    // Sustituye el boton por un loading
    Swal.showLoading();

    this.auth.login(this.usuario)
              .subscribe( usuario => {
                console.log(usuario);

                if(this.recordarme){
                    localStorage.setItem('email', this.usuario.email);
                }else{
                    localStorage.removeItem('email');
                }

                Swal.close();
                this.router.navigateByUrl('/home');
              },
              (httpError) => {
                console.log(httpError.error.error.message);
                // Alerta de Error
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'error',
                  title: 'Error',
                  text: httpError.error.error.message === 'INVALID_PASSWORD' ? 'Contraseña incorrecta' : 'Usuario incorrecto'
                });
              });
  }

}

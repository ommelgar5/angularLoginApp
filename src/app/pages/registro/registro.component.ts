import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';
import { Router } from '@angular/router';

// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: [
  ]
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private auth: AuthService,
              private router: Router ) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel;
  }

  onSubmit(registroFormulario: NgForm){

    if(!registroFormulario.valid) return;

    // console.log(this.usuario);
    // console.log('Formulario enviado');
    // console.log(registroFormulario);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere por favor...'
    });

    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario)
              .subscribe((token)=> {
                  console.log(token);

                  Swal.close();
                  this.router.navigateByUrl('/home');
              },
              (httpError) => {
                console.log(httpError);
                console.log(httpError.error.error.message);

                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'error',
                  title: 'Error',
                  text: httpError.error.error.message === 'EMAIL_EXISTS' ? 'El correo ya está registrado' : 'Error al crear la cuenta'
                });

              });

  }


}

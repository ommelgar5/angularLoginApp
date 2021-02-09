import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private URL = 'https://identitytoolkit.googleapis.com/v1/accounts';
   private API_KEY = 'AIzaSyDRnIsOBzt-F9TdKPbul1yteTt5tCNOT-U';

   usuarioToken: string;

/*
  INFORMACION DE FIREBASE
  https://firebase.google.com/docs/reference/rest/auth

  Registrar usuario | correo y contraseña
    https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  Autenticacion
    https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  */
  constructor( private http: HttpClient) {
    // para leer o establecer el estado de la variable usuarioToken
    this.leerToken();

  }

  logout(){
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel){

    let authData = { ...usuario, returnSecureToken: true};
    return this.http.post(`${ this.URL }:signInWithPassword?key=${ this.API_KEY }`, authData )
                    .pipe( map( httpRespueta => {
                      console.log('Entro al map de RXJS');
                      this.guardarToken(httpRespueta['idToken']);
                      return httpRespueta;
                    }));

  }

  nuevoUsuario(usuario: UsuarioModel){

  /*
    Requiere:
      peticion: POST
      data
        - email
        - password
        - returnSecureToken: boolean = true para que retorne un token

      Retorna un Observable

      Ejemplo de data retornanda si se resuelve la peticion
        {
          "expires_in": "3600",
          "token_type": "Bearer",
          "refresh_token": "[REFRESH_TOKEN]",
          "id_token": "[ID_TOKEN]",
          "user_id": "tRcfmLH7o2XrNELi...",
          "project_id": "1234567890"
        }
 */

    let authData = { ...usuario, returnSecureToken: true};

    // http.post(URL,body(carga- payload)[, Header: {}]);  -> retorna un Observable
    return this.http.post(`${ this.URL }:signUp?key=${ this.API_KEY }`, authData )
                    .pipe( map( httpRespueta => {
                      console.log('Entro al map de RXJS');
                      this.guardarToken(httpRespueta['idToken']);
                      return httpRespueta;
                    }));

}

private guardarToken( idToken: string){

  this.usuarioToken = idToken;
  localStorage.setItem('token', idToken);

  // Guardar la fecha de expiración del token
  let fechaExpiracion = new Date();
  fechaExpiracion.setSeconds(3600);

  localStorage.setItem('expiraEn', fechaExpiracion.getTime().toString() )

}

leerToken() {
  if(localStorage.getItem('token')){
    this.usuarioToken = localStorage.getItem('token');
  }else{
    this.usuarioToken = '';
  }

  return this.usuarioToken;
}


estaAutenticado () {

  if(this.usuarioToken.length < 2){
      return false;
  }

  if(localStorage.getItem('expiraEn')){
    let expiraEn = Number(localStorage.getItem('expiraEn'));
    let fechaExpiracion = new Date();
    fechaExpiracion.setTime(expiraEn);

    if(fechaExpiracion > new Date()) return true;
  }

  return false;
}



}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [CommonModule, FormsModule],
})
export class Login {
  email = '';
  senha = '';
  mensagemErro = '';

  constructor(private router: Router) {}

  async fazerLogin() {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.senha,
    });

    if (error) {
      this.mensagemErro = error.message;
      console.error('Erro no login:', error.message);
    } else {
      console.log('Login bem-sucedido:', data);
      this.router.navigate(['/dashboard']);
    }
  }
  
  async esqueciSenha() {
  if (!this.email) {
    this.mensagemErro = 'Informe seu e-mail para redefinir a senha.';
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(this.email);

  if (error) {
    this.mensagemErro = error.message;
  } else {
    this.mensagemErro = 'Link de redefinição de senha enviado para seu e-mail.';
  }
}

}

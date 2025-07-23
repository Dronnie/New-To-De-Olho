import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css', // reutiliza o CSS do login
  imports: [CommonModule, FormsModule]
})
export class Register {
  nome = '';
  telefone = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  mensagemErro = '';
  mensagemSucesso = '';
  aceitaEmail = false;
  aceitaSms = false;
  aceitaTermos = false;


  constructor(private router: Router) {}

  async fazerCadastro() {
    if (this.senha !== this.confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem.';
      return;
    }

    if (!this.aceitaTermos) {
    this.mensagemErro = 'Você deve aceitar os Termos de Uso para continuar.';
    return;
    }


    const { error, data } = await supabase.auth.signUp({
      email: this.email,
      password: this.senha
    });

    if (error) {
      this.mensagemErro = error.message;
      this.mensagemSucesso = '';
    } else {
      this.mensagemSucesso = 'Cadastro realizado! Verifique seu e-mail.';
      this.mensagemErro = '';
    }
  }
}

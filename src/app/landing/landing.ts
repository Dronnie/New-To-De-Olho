import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  abrirChat = false;
  tamanhoFonteBase = 100; // em %

ajustarFonte(valor: number) {
  this.tamanhoFonteBase += valor * 10;
  document.documentElement.style.fontSize = `${this.tamanhoFonteBase}%`;
}


  mensagensExtras: { tipo: 'user' | 'bot', texto: string }[] = [];

responder(tipo: 'como' | 'pagar') {
  if (tipo === 'como') {
    this.mensagensExtras.push(
      { tipo: 'user', texto: 'Como funciona a plataforma?' },
      { tipo: 'bot', texto: 'Você pode acompanhar políticos, favoritar e receber notificações sobre votações, faltas, despesas e muito mais.' }
    );
  }

  if (tipo === 'pagar') {
    this.mensagensExtras.push(
      { tipo: 'user', texto: 'Preciso pagar alguma coisa?' },
      { tipo: 'bot', texto: 'Não! A plataforma é totalmente gratuita para todos os cidadãos.' }
    );
  }
}
}

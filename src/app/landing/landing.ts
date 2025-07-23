import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  abrirChat = false;
  tamanhoFonteBase = 100; // em %

  mensagensExtras: { tipo: 'user' | 'bot', texto: string }[] = [];
  mostrarOpcoes = true;

  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {}

  ajustarFonte(valor: number) {
    this.tamanhoFonteBase += valor * 10;
    document.documentElement.style.fontSize = `${this.tamanhoFonteBase}%`;
  }

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

    this.mostrarOpcoes = false;

    // Aguarda a renderização e faz o scroll para o fim do chat
    setTimeout(() => {
      if (this.chatBody) {
        const el = this.chatBody.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}

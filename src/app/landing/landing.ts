import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing implements AfterViewInit {
  abrirChat = false;
  tamanhoFonteBase = 100;

  mensagensIniciais: { tipo: 'bot' | 'user'; texto: string }[] = [
    { tipo: 'bot', texto: 'Olá! Como posso te ajudar hoje?' },
    { tipo: 'user', texto: 'O que é o To De Olho?' },
    { tipo: 'bot', texto: 'É uma plataforma para acompanhar a atuação de políticos brasileiros.' },
    { tipo: 'user', texto: 'Preciso me cadastrar para usar?' },
    { tipo: 'bot', texto: 'Sim! O cadastro permite favoritar políticos e receber atualizações.' }
  ];

  mensagensExibidas: { tipo: 'bot' | 'user'; texto: string }[] = [];
  mostrarOpcoes = true;

  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.iniciarChat();
  }

iniciarChat() {
  let i = 0;

  const exibirProxima = () => {
    if (i < this.mensagensIniciais.length) {
      this.mensagensExibidas.push(this.mensagensIniciais[i]);
      i++;

      // Ajusta delay conforme a mensagem (exemplo: primeiras 2 mensagens 2000ms, depois 3500ms)
      const delay = i <= 2 ? 2000 : 3500;

      setTimeout(() => {
        this.scrollChatToBottom();
        exibirProxima();
      }, delay);
    }
  };

  exibirProxima();
}


  scrollChatToBottom() {
    setTimeout(() => {
      if (this.chatBody) {
        const el = this.chatBody.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }

  lerTexto() {
  const texto = document.body.innerText; // ou selecione um elemento específico
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR'; // voz em português do Brasil
  speechSynthesis.speak(utterance);
}


  ajustarFonte(valor: number) {
    this.tamanhoFonteBase += valor * 10;
    document.documentElement.style.fontSize = `${this.tamanhoFonteBase}%`;
  }

  responder(tipo: 'como' | 'pagar') {
    if (tipo === 'como') {
      this.mensagensExibidas.push(
        { tipo: 'user', texto: 'Como funciona a plataforma?' },
        { tipo: 'bot', texto: 'Você pode acompanhar políticos, favoritar e receber notificações sobre votações, faltas, despesas e muito mais.' }
      );
    }

    if (tipo === 'pagar') {
      this.mensagensExibidas.push(
        { tipo: 'user', texto: 'Preciso pagar alguma coisa?' },
        { tipo: 'bot', texto: 'Não! A plataforma é totalmente gratuita para todos os cidadãos.' }
      );
    }

    this.mostrarOpcoes = false;
    this.scrollChatToBottom();
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  toggleChat() {
    this.abrirChat = !this.abrirChat;
    if (this.abrirChat && this.mensagensExibidas.length === 0) {
      this.iniciarChat();
    }
  }

  clicarMensagem(msg: { tipo: 'user' | 'bot', texto: string }) {
  if (msg.tipo === 'user') {
    if (msg.texto.includes('Como funciona')) {
      this.responder('como');
    } else if (msg.texto.includes('Preciso pagar')) {
      this.responder('pagar');
    }
  }
}

  // Exemplo de ação ao clicar em uma mensagem
  onMensagemClick(msg: { tipo: 'bot' | 'user'; texto: string }) {
    // Aqui você pode definir alguma ação, como repetir a resposta, abrir link, etc
    alert(`Você clicou na mensagem: "${msg.texto}"`);
  }
}

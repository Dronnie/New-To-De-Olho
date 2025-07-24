import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-termos-de-uso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './termos-de-uso.html',
  styleUrl: './termos-de-uso.css'
})
export class TermosDeUso {

  tamanhoFonteBase = 100;

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


}

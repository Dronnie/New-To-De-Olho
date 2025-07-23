import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css'
})
export class Sobre {
  tamanhoFonteBase = 100;

  ajustarFonte(valor: number) {
    this.tamanhoFonteBase += valor * 10;
    if(this.tamanhoFonteBase < 50) this.tamanhoFonteBase = 50;
    if(this.tamanhoFonteBase > 150) this.tamanhoFonteBase = 150;
    document.documentElement.style.fontSize = `${this.tamanhoFonteBase}%`;
  }
}

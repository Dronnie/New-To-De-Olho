import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil {
  notificarDespesas = signal(false);
  notificarCartao = signal(false);
  notificarEmendas = signal(false);

  notificarSMS = signal(false);
  notificarPush = signal(false);
  notificarEmail = signal(false);

  usuarioLogado = signal(true);

  salvarConfiguracoes() {
    alert('Configurações salvas com sucesso!');
    // aqui você pode salvar para backend ou localStorage
  }

  apagarConta() {
    if (confirm('Tem certeza que deseja apagar sua conta? Esta ação é irreversível.')) {
      alert('Conta apagada com sucesso!');
      this.logout();
    }
  }

  logout() {
    this.usuarioLogado.set(false);
    alert('Você saiu da plataforma.');
  }
}

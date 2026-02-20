import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
type Msg = { role: 'user' | 'assistant'; text: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./app.css']
})
export class App {
  messages: Msg[] = [];
  input = '';
  loading = false;
  model = 'llama3.1:8b';

  constructor(private chatService: ChatService) {}

  send() {
    const text = this.input.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', text });
    this.input = '';
    this.loading = true;

    this.chatService.chat(text, this.model).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', text: res.reply });
        this.loading = false;
      },
      error: (err) => {
        this.messages.push({
          role: 'assistant',
          text: `Error: ${err?.error?.error || err.message || 'Unknown error'}`
        });
        this.loading = false;
      }
    });
  }
}
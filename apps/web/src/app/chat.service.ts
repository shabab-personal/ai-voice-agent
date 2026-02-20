import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ChatResponse = { reply: string; model: string };

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiBase = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  chat(message: string, model?: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiBase}/chat`, { message, model });
  }
}
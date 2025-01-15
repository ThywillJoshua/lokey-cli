import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);

  ngOnInit(): void {
    setTimeout(() => {
      this.http.get('/i18n/').subscribe(console.log);
      this.http.get('/config/').subscribe(console.log);
    }, 5000);
  }
}

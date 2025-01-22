import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [],
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.scss',
})
export class TranslateComponent implements OnInit {
  route = inject(ActivatedRoute);
  key = signal(
    decodeURIComponent(this.route.snapshot.paramMap.get('id') || '')
  );

  ngOnInit() {
    // Access route parameter
    console.log(this.key());
  }
}

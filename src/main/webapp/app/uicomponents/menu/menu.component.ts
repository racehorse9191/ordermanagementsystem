import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  todaysSplVal: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}

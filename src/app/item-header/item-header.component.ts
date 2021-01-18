import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-item-header',
  templateUrl: './item-header.component.html',
  styleUrls: ['./item-header.component.scss']
})
export class ItemHeaderComponent implements OnInit, OnChanges {
  loggedUser: any;

  constructor() {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
   }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    console.log(this.selectedItem);
  }

  @Input() selectedItem: any;

  ngOnInit() {
  }

}

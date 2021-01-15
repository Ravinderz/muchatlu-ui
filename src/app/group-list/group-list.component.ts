import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @Input() list: any;
  @Input() listType: string;

  @Output() selectedItemEvent = new EventEmitter<any>();

  constructor() { }

  selectedItemIndex: string = null;

  ngOnInit() {
    console.log(this.list);
  }

  selectedItem(index:any){
    this.selectedItemIndex = index;
    this.selectedItemEvent.emit(this.list[index]);
  }
}

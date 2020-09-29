import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'AngularApp';
  employees: [];
  constructor() { }

  ngOnInit(): void {
  }

  fetchEmployee(): void{
    alert('fetch employee');
    axios.get('http://localhost:5000/employee').then(res => {
      this.employees = res.data;
    });
  }
}

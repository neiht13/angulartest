import axios from 'axios';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements  OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'name'];
  dataSource = undefined;

  ngOnInit(): void {
    axios.get('http://localhost:5000/cities').then(res => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
interface Cities {
  id: string;
  name: string;
}

const dataV = [{id: 'cl', name: 'Cao Lanh'}, {id: 'ct', name: 'Can Tho'}, {id: 'sd', name: 'Sa Dec'}, {id: 'sg', name: 'Sai Gon'}];

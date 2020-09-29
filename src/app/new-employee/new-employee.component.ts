import { EmployeeService } from './../employee/employee.service';
import { Employee } from './../employee/employee.model';
import {Component, OnInit} from '@angular/core';
import axios from 'axios';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';

import * as moment from 'moment';
import {FormControl} from '@angular/forms';
import { Cities } from '../cities/cities.model';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {
  cities = undefined;
  newEmployee = {
    id: null,
    name: null,
    gender: null,
    birthday: null,
    city: null,
  };
  genders = [{id: 1, name: 'Male'}, {id: 2, name: 'Female'}, {id: 3, name: 'Other'}];
  selectId = undefined;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    ) {}
  public date;
  ngOnInit(): void {
    this.employeeService.getCities().subscribe(data => {
      this.cities = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Cities;
      });
    });
    this.selectId = this.route.snapshot.paramMap.get('id');
    // if (this.selectId) {
    //   axios.get('http://localhost:5000/employee/' + this.selectId).then(res => {
    //     const temp = res.data[0];
    //     temp.birthday = moment(temp.birthday, 'DD/MM/YYYY');
    //     this.date = new FormControl(new Date(temp.birthday));
    //     this.newEmployee = temp;
    //   });
    // }
    if (this.selectId) {
      this.employeeService.getOne(this.selectId).subscribe(data => {
        this.newEmployee = {
          id: data.payload.id,
          ...data.payload.data(),
        } as Employee;
        this.newEmployee.birthday = moment(this.newEmployee.birthday, 'DD/MM/YYYY');
      });
    }
  }

  back(): void {
    this.location.back();
  }
  handleSave(): void {
    this.selectId ? this.edit() : this.createNew();
    this.router.navigate(['/employee']);
  }

  birthdayChange(date): void {
    this.newEmployee.birthday = date;
  }

  createNew(): void {
    // axios.post('http://localhost:5000/employee/new', this.newEmployee).then(res => {
    //   console.log(res);
    // });
    this.employeeService.createEmployee(this.newEmployee).then(res => {
      console.log(res);
      }
    );
  }

  edit(): void {
    this.employeeService.updateEmployee(this.newEmployee).then(res => {
      console.log(res);
      }
    );
  }
}

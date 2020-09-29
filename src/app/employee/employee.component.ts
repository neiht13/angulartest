import axios from 'axios';

import {Component, OnInit, ViewChild, AfterViewInit, Input, Inject} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { Cities } from './../cities/cities.model';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employee: Employee[];
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel(this.allowMultiSelect, this.initialSelection);
  @Input() employeeList: [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'gender', 'birthday', 'city', 'select'];
  dataSource = undefined;
  cities = undefined;
  panelOpenState = false;
  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    // axios.get('http://localhost:5000/cities').then(res => {
    //   this.cities = res.data;
    // });
    this.employeeService.getCities().subscribe(data => {
      this.cities = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Cities;
      });
      console.log(this.cities);
    });
    this.fetchData();
  }

  fetchData(): void {
    // axios.get('http://localhost:5000/employee').then(res => {
    //   this.dataSource = new MatTableDataSource(res.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
    this.employeeService.getEmployee().subscribe(data => {
      this.employee = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Employee;
      });
      console.log(this.employee);
      this.dataSource = new MatTableDataSource(this.employee);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filterCities(id): any {
    if (this.cities) {
      const city = this.cities.find(item => item.id === id);
      return city && city.name;
    }
  }


  openSnackBar(row): any {
    this.snackBar.open(row.name + ' ' + this.filterCities(row.city), null, {
      duration: 2000,
      horizontalPosition: 'left',
      verticalPosition: 'top',
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  createEmployee(): void {
    this.router.navigate(['/new-employee']);
  }

  editEmployee(emp): void {
    if (emp){
      this.router.navigate(['/edit-employee', emp.id]);
    } else if (this.selection.selected.length !== 1) {
      alert('Please select an Employee!!!');
    } else {
      this.router.navigate(['/edit-employee', this.selection.selected[0].id]);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '250px'
    });
  }


  deleteEmployee(): void {
    console.log(this.selection.selected);
    if (this.selection.selected.length < 1) {
      alert('Please select an Employee!!!');
    } else {
        const dialogRef = this.dialog.open(DeleteConfirmComponent, {
          width: '250px',
          data: this.selection.selected
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            this.fetchData();
          }
          this.selection.clear();
        });
    }
  }
}


@Component({
  selector: 'app-delete-confirm-component',
  templateUrl: 'delete-confirm-component.html',
  styleUrls: ['./employee.component.css']
})
export class DeleteConfirmComponent {

  constructor(
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) {}
  onDelete(): void {
    // axios.post('http://localhost:5000/employee/delete', this.data).then(res => {
    //   this.dialogRef.close();
    //   }
    // );

    this.employeeService.deleteEmployee(this.data);
    this.dialogRef.close();
  }
}

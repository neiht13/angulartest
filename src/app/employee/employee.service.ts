import { AngularFirestore } from '@angular/fire/firestore';
import { Employee } from './employee.model';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
    constructor(private firestore: AngularFirestore) { }
    getOne(id: string): any {
        return this.firestore.collection('employee').doc(id).snapshotChanges();
    }

    getEmployee(): any {
        return this.firestore.collection('employee').snapshotChanges();
    }
    getCities(): any {
        return this.firestore.collection('cities').snapshotChanges();
    }
    createEmployee(employee: Employee): any {
        delete employee.id;
        employee.birthday = moment(employee.birthday).format('DD/MM/YYYY');
        return this.firestore.collection('employee').add(employee);
    }
    updateEmployee(employee: Employee): any {
        const updateId = employee.id;
        delete employee.id;
        employee.birthday = moment(employee.birthday).format('DD/MM/YYYY');
        return this.firestore.doc('employee/' + updateId).update(employee);
    }
    deleteEmployee(employeeList: Employee[]): any {
        employeeList.forEach(employee => {
            this.firestore.doc('employee/' + employee.id).delete();
        });
        return 'success';
    }
  }

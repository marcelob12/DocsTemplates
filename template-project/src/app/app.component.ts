import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DropdownModule, FormsModule, CommonModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent {

  formalitiesOptions: { id: number, name: string }[] =
    [
      { id: 1, name: 'Solvencia' },
      { id: 2, name: 'Vialidad' },
    ];

  templateDownload: object[] = [
    { 'Correlativo': 'test' },
    { 'NumeroNitDelEmpleado': 'test' },
    { 'Pasaporte': 'test' },
    { 'Nombres': '' },
    { 'Apellidos': '' },
    { 'DireccionDeResidencia': '' }
  ]

  selectedFormality: { name: string } | undefined;
  documentData: any[] = [];


  correlativeError: boolean = false;
  passportError: boolean = false;
  niterror: boolean = false;
  lastnameError: boolean = false;
  nameError: boolean = false;
  addressError: boolean = false;

  constructor(
    public toastService: MessageService

  ) { }

  exportExampleTemplate() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.templateDownload);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'PlantillaVialidad.xlsx');
  }
  uploadTemplateinfo(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = fileReader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Suponemos que solo hay una hoja en el archivo
        const worksheet = workbook.Sheets[sheetName];
        this.documentData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });


        const excelObject: any[] = [];
        for (let i = 1; i < this.documentData.length; i++) {
          const rowData = this.documentData[i];
          const headerRow = this.documentData[0];
          const rowDataObject: any = {};
          for (let j = 0; j < rowData.length; j++) {
            rowDataObject[headerRow[j]] = rowData[j];
          }
          excelObject.push(rowDataObject);
        }

        const regex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/;

        excelObject.forEach((element: any) => {
          if (element.Correlativo === undefined || typeof element.Correlativo != 'number') {
            this.correlativeError = true;
          }
          if (element.NumeroNitDelEmpleado === undefined || typeof element.NumeroNitDelEmpleado != 'number' || element.NumeroNitDelEmpleado.toString().length != 9 && element.NumeroNitDelEmpleado.toString().length != 14) {
            this.niterror = true;
          }
          if (element.Pasaporte === undefined || typeof element.Pasaporte != 'number' || element.Pasaporte.toString().length != 9 || element.Pasaporte.toString().length != 14) {
            this.passportError = true;
          }
          if (element.Nombres === undefined || typeof element.Nombres != 'string' || !regex.test(element.Nombres)) {
            this.nameError = true;
          }
          if (element.Apellidos === undefined || typeof element.Apellidos != 'string' || !regex.test(element.Apellidos)) {
            this.lastnameError = true;
          }
          if (element.DireccionDeResidencia === undefined || typeof element.DireccionDeResidencia != 'string') {
            this.addressError = true;
          }
        })
        this.validateErrors();
      };
      // validar que ningun campo este vacio
      fileReader.readAsBinaryString(selectedFile);
    }
  }



  restartDoc() {
    this.documentData = [];
    this.correlativeError = false,
      this.passportError = false,
      this.niterror = false,
      this.lastnameError = false,
      this.nameError = false,
      this.addressError = false;
  }


  validateErrors() {
    if (this.correlativeError) {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Correlativo no válido, por favor ingresar correlativo valido' });
    }
    if (this.passportError) {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Pasaporte no válido, por favor ingresar pasaporte valido' });
    }
    if (this.niterror) {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'NIT no válido, porfavor ingresar NIT valido' });
    }
    if (this.lastnameError) {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Apellidos no válidos, porfavor ingresar apellidos validos' });
    }
    if (this.nameError) {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Nombres no válidos, Porfavor ingresar nombres validos' });
    }
    if (this.addressError) {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Dirección de residencia no válida, por favor ingresar direccion valida' });
    }
  }

}


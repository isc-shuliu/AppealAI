import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzHeaderComponent, NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ICompany } from '../../../interface/company.interface';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-create-view',
  standalone: true,
  imports: [
    CommonModule,
    NzHeaderComponent,
    NzLayoutModule,
    NzFlexModule,
    NzPageHeaderModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    RouterLink,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './create-view.component.html',
  styleUrl: './create-view.component.scss',
})
export class CreateViewComponent implements OnInit {
  constructor(private fb: NonNullableFormBuilder) {}
  ngOnInit(): void {
    this.listInsuranceOrg = [
      { UUIDFHIR: '1', name: 'test1', id: '1' },
      { UUIDFHIR: '2', name: 'test2', id: '2' },
    ];
  }
  @Input() typeOfObj: string | null;
  @Input() newCreatedCompany!: ICompany | null;
  @Input() listInsuranceOrg: ICompany[] | null;

  @Output() addNewCompany = new EventEmitter();
  @Output() addNewPackage = new EventEmitter();

  selectedFiles: any;

  docsForm: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    listDocs: FormControl<File | null>;
    companyId: FormControl<string>;
    companyName: FormControl<string>;
  }> = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    listDocs: new FormControl<File | null>(null, [Validators.required]),
    companyId: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
  });

  showPackageForm = false;

  createCompany() {
    if (this.docsForm.value.companyName) {
      this.addNewCompany.emit(this.docsForm.value.companyName);
      this.showPackageForm = true;
    }
    if (this.newCreatedCompany) {
      this.docsForm.controls['companyName'].disable();
    }
  }

  createPackage() {
    console.log(this.docsForm);
    const newPackage = {
      name: this.docsForm.value.name,
      description: this.docsForm.value.description,
      companyId: this.newCreatedCompany?.id,
    };
    this.addNewPackage.emit(newPackage);
  }

  addListDocs(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFiles = target.files as FileList;
    console.log(this.selectedFiles);

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && reader.result) {
        const blob = new Blob([reader.result], {
          type: this.selectedFiles[0].type,
        });
        console.log(blob);
        var element = document.querySelector('p');

        if (element) {
          for (let i = 0; i < this.selectedFiles.length; i++) {
            // Removed the function declaration as it's not needed
            let f = this.selectedFiles[i]; // Changed 'this.files[i]' to 'this.selectedFiles[i]'
            element.innerHTML = `${element.innerHTML} ${f.name} ${f.size} ${f.type}`; // Fixed the concatenation of file details
          }
        }
      } else {
        console.error('File could not be read.');
      }
    };

    reader.readAsArrayBuffer(this.selectedFiles[0]); // Changed 'this.selectedFile' to 'this.selectedFiles[0]'
  }

  selectCompany(value: { name: string; id: string; UUIDFHIR: string }): void {
    if (value) {
      this.docsForm.controls['companyId'].patchValue(value.id);
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { Servicio } from "../../models/servicio";
import { ServiciosService } from "../../services/servicios.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: "app-servicios",
  templateUrl: "./servicios.component.html",
  styleUrls: ["./servicios.component.css"]
})
export class ServiciosComponent implements OnInit {
  Titulo = "Servicios";
  Items: Servicio[] = [];
  TituloAccionABMC = {
    A: "(Agregar)",
    L: "(Listado)"
  };
  AccionABMC = "L";

  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private ServicioService: ServiciosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormReg = this.formBuilder.group({
      IdArticulo: [0],
      Descripcion: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]
      ],
      Importe: [
        null,
        [Validators.required, Validators.pattern("[0-9]{1,7}[-.][0-9]{2}")]
      ],
      CantidadHoras: [
        null,
        [Validators.required, Validators.pattern("[0-9]{1,7}")]
      ]
    });

    this.GetServicios();
  }

  GetServicios() {
    this.ServicioService.get().subscribe((res: Servicio[]) => {
      this.Items = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset();
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }

  Volver() {
    this.AccionABMC = "L";
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    // agregar post

    this.ServicioService.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      this.modalDialogService.Alert("Registro agregado correctamente.");
      this.GetServicios();
    });
  }
}

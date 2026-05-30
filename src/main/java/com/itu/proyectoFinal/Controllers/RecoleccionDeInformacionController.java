package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.RecoleccionDeInformacion;
import com.itu.proyectoFinal.Services.RecoleccionDeInformacionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/recoleccionDeInformacion")
public class RecoleccionDeInformacionController extends BaseControllerImpl<RecoleccionDeInformacion, RecoleccionDeInformacionServiceImpl>{
}

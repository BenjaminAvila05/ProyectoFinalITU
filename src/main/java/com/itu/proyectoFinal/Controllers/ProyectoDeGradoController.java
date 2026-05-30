package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.ProyectoDeGrado;
import com.itu.proyectoFinal.Services.ProyectoDeGradoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/proyectoDeGrado")
public class ProyectoDeGradoController extends BaseControllerImpl<ProyectoDeGrado, ProyectoDeGradoServiceImpl>{
}

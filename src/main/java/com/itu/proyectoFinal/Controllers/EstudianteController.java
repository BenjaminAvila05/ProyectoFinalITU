package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.Estudiante;
import com.itu.proyectoFinal.Services.EstudianteServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/estudiante")
public class EstudianteController extends BaseControllerImpl<Estudiante, EstudianteServiceImpl>{
}

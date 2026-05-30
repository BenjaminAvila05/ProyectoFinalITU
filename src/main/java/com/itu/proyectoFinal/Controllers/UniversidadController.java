package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.Universidad;
import com.itu.proyectoFinal.Services.UniversidadServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/universidad")
public class UniversidadController extends BaseControllerImpl<Universidad, UniversidadServiceImpl>{
}

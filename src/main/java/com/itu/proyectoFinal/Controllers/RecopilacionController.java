package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.Recopilacion;
import com.itu.proyectoFinal.Services.RecopilacionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/recopilacion")
public class RecopilacionController extends BaseControllerImpl<Recopilacion, RecopilacionServiceImpl>{
}

package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.Resultado;
import com.itu.proyectoFinal.Services.ResultadoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/resultado")
public class ResultadoController extends BaseControllerImpl<Resultado, ResultadoServiceImpl>{
}

package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.Problema;
import com.itu.proyectoFinal.Services.ProblemaServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/problema")
public class ProblemaController extends BaseControllerImpl<Problema, ProblemaServiceImpl>{
}

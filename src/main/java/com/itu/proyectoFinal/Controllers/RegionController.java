package com.itu.proyectoFinal.Controllers;

import com.itu.proyectoFinal.Entities.Region;
import com.itu.proyectoFinal.Services.RegionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/region")
public class RegionController extends BaseControllerImpl<Region, RegionServiceImpl>{
}

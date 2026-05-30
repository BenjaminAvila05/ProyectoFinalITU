package Controllers;

import Entities.ProyectoDeGrado;
import Services.ProyectoDeGradoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/proyectosDeGrados")
public class ProyectoDeGradoController extends BaseControllerImpl<ProyectoDeGrado, ProyectoDeGradoServiceImpl>{
}

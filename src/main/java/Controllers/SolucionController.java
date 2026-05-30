package Controllers;

import Entities.Solucion;
import Services.SolucionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/soluciones")
public class SolucionController extends BaseControllerImpl<Solucion, SolucionServiceImpl>{
}

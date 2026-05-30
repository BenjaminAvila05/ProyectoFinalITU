package Controllers;

import Entities.RecoleccionDeInformacion;
import Services.RecoleccionDeInformacionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/recolecciones")
public class RecoleccionDeInformacionController extends BaseControllerImpl<RecoleccionDeInformacion, RecoleccionDeInformacionServiceImpl>{
}

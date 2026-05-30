package Controllers;

import Entities.InterfazIngresoInformacion;
import Services.InterfazIngresoInformacionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/interfazIngresoInformacion")
public class InterfazIngresoInformacionController extends BaseControllerImpl<InterfazIngresoInformacion, InterfazIngresoInformacionServiceImpl>{
}

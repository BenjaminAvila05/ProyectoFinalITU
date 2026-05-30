package Controllers;

import Entities.Recopilacion;
import Services.RecopilacionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/recopilaciones")
public class RecopilacionController extends BaseControllerImpl<Recopilacion, RecopilacionServiceImpl>{
}

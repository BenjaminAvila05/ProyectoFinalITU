package Controllers;

import Entities.Universidad;
import Services.UniversidadServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/universidades")
public class UniversidadController extends BaseControllerImpl<Universidad, UniversidadServiceImpl>{
}

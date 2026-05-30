package Controllers;

import Entities.EjecucionDelProyecto;
import Services.EjecucionDelProyectoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/ejecucionDelProyecto")
public class EjecucionDelProyectoController extends BaseControllerImpl<EjecucionDelProyecto, EjecucionDelProyectoServiceImpl>{
}

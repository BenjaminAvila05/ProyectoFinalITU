package Controllers;

import Entities.Estudiante;
import Services.EstudianteServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/estudiantes")
public class EstudianteController extends BaseControllerImpl<Estudiante, EstudianteServiceImpl>{
}

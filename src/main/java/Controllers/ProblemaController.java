package Controllers;

import Entities.Problema;
import Services.ProblemaServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/problemas")
public class ProblemaController extends BaseControllerImpl<Problema, ProblemaServiceImpl>{
}

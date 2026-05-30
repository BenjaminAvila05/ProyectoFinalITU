package Controllers;

import Entities.Region;
import Services.RegionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/regiones")
public class RegionController extends BaseControllerImpl<Region, RegionServiceImpl>{
}

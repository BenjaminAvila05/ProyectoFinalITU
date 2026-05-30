package Services;

import Entities.RecoleccionDeInformacion;
import Repositories.BaseRepository;
import Repositories.RecoleccionDeInformacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecoleccionDeInformacionServiceImpl extends BaseServiceImpl<RecoleccionDeInformacion, Long> implements RecoleccionDeInformacionService {

    @Autowired
    private RecoleccionDeInformacionRepository recoleccionDelInformacionRepository;

    public RecoleccionDeInformacionServiceImpl(BaseRepository<RecoleccionDeInformacion, Long> baseRepository) {
        super(baseRepository);
    }
}

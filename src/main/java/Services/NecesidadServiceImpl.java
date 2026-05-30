package Services;

import Entities.Necesidad;
import Repositories.BaseRepository;
import Repositories.NecesidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NecesidadServiceImpl extends BaseServiceImpl<Necesidad, Long> implements NecesidadService {

    @Autowired
    private NecesidadRepository necesidadRepository;

    public NecesidadServiceImpl(BaseRepository<Necesidad, Long> baseRepository) {
        super(baseRepository);
    }
}

package Services;

import Entities.Solucion;
import Repositories.BaseRepository;
import Repositories.SolucionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolucionServiceImpl extends BaseServiceImpl<Solucion, Long> implements SolucionService {

    @Autowired
    private SolucionRepository solucionRepository;

    public SolucionServiceImpl(BaseRepository<Solucion, Long> baseRepository) {
        super(baseRepository);
    }
}

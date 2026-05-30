package Services;

import Entities.EjecucionDelProyecto;
import Repositories.BaseRepository;
import Repositories.EjecucionDelProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EjecucionDelProyectoServiceImpl extends BaseServiceImpl<EjecucionDelProyecto, Long>
        implements EjecucionDelProyectoService {

    @Autowired
    private EjecucionDelProyectoRepository ejecucionDelProyectoRepository;

    public EjecucionDelProyectoServiceImpl(BaseRepository<EjecucionDelProyecto, Long> baseRepository) {
        super(baseRepository);
    }
}
package Services;

import Entities.ProyectoDeGrado;
import Repositories.BaseRepository;
import Repositories.ProyectoDeGradoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProyectoDeGradoServiceImpl extends BaseServiceImpl<ProyectoDeGrado, Long>
        implements ProyectoDeGradoService {

    @Autowired
    private ProyectoDeGradoRepository proyectoDeGradoRepository;

    public ProyectoDeGradoServiceImpl(BaseRepository<ProyectoDeGrado, Long> baseRepository) {
        super(baseRepository);
    }
}

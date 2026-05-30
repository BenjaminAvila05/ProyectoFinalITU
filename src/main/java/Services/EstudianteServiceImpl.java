package Services;

import Entities.Estudiante;
import Repositories.BaseRepository;
import Repositories.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstudianteServiceImpl extends BaseServiceImpl<Estudiante, Long> implements EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    public EstudianteServiceImpl(BaseRepository<Estudiante, Long> baseRepository) {
        super(baseRepository);
    }
}

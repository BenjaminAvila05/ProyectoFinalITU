package Services;

import Entities.Universidad;
import Repositories.BaseRepository;
import Repositories.UniversidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UniversidadServiceImpl extends BaseServiceImpl<Universidad, Long> implements UniversidadService {

    @Autowired
    private UniversidadRepository universidadRepository;

    public UniversidadServiceImpl(BaseRepository<Universidad, Long> baseRepository) {
        super(baseRepository);
    }
}
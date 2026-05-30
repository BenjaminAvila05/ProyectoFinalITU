package Services;

import Entities.Recopilacion;
import Repositories.BaseRepository;
import Repositories.RecopilacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecopilacionServiceImpl extends BaseServiceImpl<Recopilacion, Long> implements RecopilacionService {

    @Autowired
    private RecopilacionRepository recopilacionRepository;

    public RecopilacionServiceImpl(BaseRepository<Recopilacion, Long> baseRepository) {
        super(baseRepository);
    }
}

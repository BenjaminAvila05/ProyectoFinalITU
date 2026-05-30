package Services;

import Entities.Resultado;
import Repositories.BaseRepository;
import Repositories.ResultadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResultadoServiceImpl extends BaseServiceImpl<Resultado, Long> implements ResultadoService {

    @Autowired
    private ResultadoRepository resultadoRepository;

    public ResultadoServiceImpl(BaseRepository<Resultado, Long> baseRepository) {
        super(baseRepository);
    }
}

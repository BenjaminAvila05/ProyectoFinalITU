package Services;

import Entities.InterfazIngresoInformacion;
import Repositories.BaseRepository;
import Repositories.InterfazIngresoInformacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterfazIngresoInformacionServiceImpl extends BaseServiceImpl<InterfazIngresoInformacion, Long>
        implements InterfazIngresoInformacionService {

    @Autowired
    private InterfazIngresoInformacionRepository interfazIngresoInformacionRepository;

    public InterfazIngresoInformacionServiceImpl(BaseRepository<InterfazIngresoInformacion, Long> baseRepository) {
        super(baseRepository);
    }
}

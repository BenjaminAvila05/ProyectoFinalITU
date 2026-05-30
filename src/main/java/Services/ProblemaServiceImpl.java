package Services;

import Entities.Problema;
import Repositories.BaseRepository;
import Repositories.ProblemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProblemaServiceImpl extends BaseServiceImpl<Problema, Long> implements ProblemaService {

    @Autowired
    private ProblemaRepository problemaRepository;

    public ProblemaServiceImpl(BaseRepository<Problema, Long> baseRepository) {
        super(baseRepository);
    }
}

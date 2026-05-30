package Services;

import Entities.PersonalDocente;
import Repositories.BaseRepository;
import Repositories.PersonalDocenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalDocenteServiceImpl extends BaseServiceImpl<PersonalDocente, Long>
        implements PersonalDocenteService {

    @Autowired
    private PersonalDocenteRepository personalDocenteRepository;

    public PersonalDocenteServiceImpl(BaseRepository<PersonalDocente, Long> baseRepository) {
        super(baseRepository);
    }
}

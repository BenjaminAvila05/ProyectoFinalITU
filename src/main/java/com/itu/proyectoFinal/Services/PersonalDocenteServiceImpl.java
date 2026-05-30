package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.PersonalDocente;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.PersonalDocenteRepository;
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

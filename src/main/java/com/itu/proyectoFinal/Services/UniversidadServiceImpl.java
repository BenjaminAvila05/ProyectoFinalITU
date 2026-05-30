package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.Universidad;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.UniversidadRepository;
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
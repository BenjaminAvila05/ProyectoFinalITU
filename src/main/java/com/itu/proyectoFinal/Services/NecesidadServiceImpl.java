package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.Necesidad;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.NecesidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NecesidadServiceImpl extends BaseServiceImpl<Necesidad, Long> implements NecesidadService {

    @Autowired
    private NecesidadRepository necesidadRepository;

    public NecesidadServiceImpl(BaseRepository<Necesidad, Long> baseRepository) {
        super(baseRepository);
    }
}

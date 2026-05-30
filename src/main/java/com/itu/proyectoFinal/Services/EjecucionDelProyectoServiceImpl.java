package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.EjecucionDelProyecto;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.EjecucionDelProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EjecucionDelProyectoServiceImpl extends BaseServiceImpl<EjecucionDelProyecto, Long>
        implements EjecucionDelProyectoService {

    @Autowired
    private EjecucionDelProyectoRepository ejecucionDelProyectoRepository;

    public EjecucionDelProyectoServiceImpl(BaseRepository<EjecucionDelProyecto, Long> baseRepository) {
        super(baseRepository);
    }
}
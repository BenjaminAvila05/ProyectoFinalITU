package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.ProyectoDeGrado;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.ProyectoDeGradoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProyectoDeGradoServiceImpl extends BaseServiceImpl<ProyectoDeGrado, Long>
        implements ProyectoDeGradoService {

    @Autowired
    private ProyectoDeGradoRepository proyectoDeGradoRepository;

    public ProyectoDeGradoServiceImpl(BaseRepository<ProyectoDeGrado, Long> baseRepository) {
        super(baseRepository);
    }
}

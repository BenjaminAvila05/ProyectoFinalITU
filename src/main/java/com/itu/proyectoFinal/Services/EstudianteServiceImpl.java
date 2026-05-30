package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.Estudiante;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstudianteServiceImpl extends BaseServiceImpl<Estudiante, Long> implements EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    public EstudianteServiceImpl(BaseRepository<Estudiante, Long> baseRepository) {
        super(baseRepository);
    }
}

package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.Recopilacion;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.RecopilacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecopilacionServiceImpl extends BaseServiceImpl<Recopilacion, Long> implements RecopilacionService {

    @Autowired
    private RecopilacionRepository recopilacionRepository;

    public RecopilacionServiceImpl(BaseRepository<Recopilacion, Long> baseRepository) {
        super(baseRepository);
    }
}

package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.RecoleccionDeInformacion;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.RecoleccionDeInformacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecoleccionDeInformacionServiceImpl extends BaseServiceImpl<RecoleccionDeInformacion, Long> implements RecoleccionDeInformacionService {

    @Autowired
    private RecoleccionDeInformacionRepository recoleccionDelInformacionRepository;

    public RecoleccionDeInformacionServiceImpl(BaseRepository<RecoleccionDeInformacion, Long> baseRepository) {
        super(baseRepository);
    }
}

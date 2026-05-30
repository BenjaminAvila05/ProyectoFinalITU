package com.itu.proyectoFinal.Services;

import com.itu.proyectoFinal.Entities.InterfazIngresoInformacion;
import com.itu.proyectoFinal.Repositories.BaseRepository;
import com.itu.proyectoFinal.Repositories.InterfazIngresoInformacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterfazIngresoInformacionServiceImpl extends BaseServiceImpl<InterfazIngresoInformacion, Long>
        implements InterfazIngresoInformacionService {

    @Autowired
    private InterfazIngresoInformacionRepository interfazIngresoInformacionRepository;

    public InterfazIngresoInformacionServiceImpl(BaseRepository<InterfazIngresoInformacion, Long> baseRepository) {
        super(baseRepository);
    }
}

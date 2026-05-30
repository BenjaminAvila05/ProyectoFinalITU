package com.itu.proyectoFinal.Entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "ejecucion_del_proyecto")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_ejecucion"))
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class EjecucionDelProyecto extends Base implements Serializable{
    
    @Column(name = "proyectoDeGradoTerminado")
    private String proyectoDeGradoTerminado;
    
    @Column(name = "recursosDiponibles")
    private int recursosDiponibles;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "comenzarDesarrollo")
    private Date comenzarDesarrollo;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "finalizarDesarrollo")
    private Date finalizarDesarrollo;
    
    @OneToMany(mappedBy = "ejecucion")
    private List<Estudiante> estudiantes = new ArrayList<>();
    
    @OneToMany(mappedBy = "estaPendiente")
    private List<PersonalDocente> docentes = new ArrayList<>();
    
    @OneToOne
    @JoinColumn(name = "id_resultado")
    private Resultado resultado;
    
    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private ProyectoDeGrado proyecto;

}

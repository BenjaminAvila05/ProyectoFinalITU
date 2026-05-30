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
import java.util.List;


@Entity
@Table(name = "PersonalDocente")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_docente"))
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class PersonalDocente extends Base implements Serializable {

    @Column(name = "conocimiento", nullable = false)
    private String conocimiento;
    
    @Column(name = "experiencia", length = 500)
    private String experiencia;
    
    @Column(name = "trayectoria")
    private int trayectoria;
    
    @Column(name = "evaluar")
    private String evaluar;
    
    @Column(name = "funcionDeSeguimiento")
    private String funcionDeSeguimiento;
    
    @Column(name = "gestion")
    private String gestion;
    
    @Column(name = "orientacion")
    private String orientacion;
    
    @ManyToOne
    @JoinColumn(name = "id_recopilacion")
    private Recopilacion participa;
    
    @ManyToOne
    @JoinColumn(name = "id_ejecucion")
    private EjecucionDelProyecto estaPendiente;
    
    @ManyToMany(mappedBy = "docentes")
    private List<Estudiante> estudiantes = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "id_universidad", nullable = false)
    private Universidad universidad;

    //Constructor
    public PersonalDocente(String conocimiento, String experiencia, int trayectoria,
                           EjecucionDelProyecto estaPendiente, Estudiante estudiante) {
        this.conocimiento = conocimiento;
        this.experiencia = experiencia;
        this.trayectoria = trayectoria;
        this.estaPendiente = estaPendiente;
        if (estudiante != null) {
            this.estudiantes.add(estudiante);
        }
    }

}

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
@Table(name = "universidad")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_universidad"))
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Universidad extends Base implements Serializable {

    @Column(name = "cuna_del_conocimiento", nullable = false)
    private String cunaDelConocimiento;
    
    @Column(name = "diferentes_carreras", length = 500, nullable = false)
    private String diferentesCarreras;
    
    @Column(name = "privada")
    private boolean privada;
    
    @Column(name = "publica")
    private boolean publica;
    
    @ManyToMany
    @JoinTable(
        name = "universidad_recoleccion",
        joinColumns = @JoinColumn(name = "id_universidad"),
        inverseJoinColumns = @JoinColumn(name = "id_recoleccion")
    )
    private List<RecoleccionDeInformacion> hace = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "universidad_region",
        joinColumns = @JoinColumn(name = "id_universidad"),
        inverseJoinColumns = @JoinColumn(name = "id_region")
    )
    private List<Region> interactuan = new ArrayList<>();
    
    @OneToMany(mappedBy = "universidad")
    private List<PersonalDocente> docentes = new ArrayList<>();
    
    @OneToMany(mappedBy = "universidad")
    private List<Estudiante> estudiantes = new ArrayList<>();

}

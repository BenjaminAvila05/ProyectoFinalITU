package com.itu.proyectoFinal.Entities;

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
@Table(name = "problema")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_problema"))
public class Problema extends Base implements Serializable {

    @Column(name = "definir", length = 500, nullable = false)
    private String definir;
    
    @ManyToMany
    @JoinTable(
        name = "problema_interfaz",
        joinColumns = @JoinColumn(name = "id_problema"),
        inverseJoinColumns = @JoinColumn(name = "id_interfaz")
    )
    private List<InterfazIngresoInformacion> ingresa = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "discute",
        joinColumns = @JoinColumn(name = "id_problema"),
        inverseJoinColumns = @JoinColumn(name = "id_necesidad")
    )
    private List<Necesidad> necesidades = new ArrayList<>();

}

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
@Table(name = "necesidad")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_necesidad"))
public class Necesidad extends Base implements Serializable {
    
    @Column(name = "definir", length = 500, nullable = false)
    private String definir;
    
    @ManyToMany
    @JoinTable(
        name = "necesidad_interfaz",
        joinColumns = @JoinColumn(name = "id_necesidad"),
        inverseJoinColumns = @JoinColumn(name = "id_interfaz")
    )
    private List<InterfazIngresoInformacion> ingresa = new ArrayList<>();
    
    @ManyToMany(mappedBy = "necesidades")
    private List<Problema> problemas = new ArrayList<>();

}

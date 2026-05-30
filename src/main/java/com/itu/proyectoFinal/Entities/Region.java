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
@Table(name = "region")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_region"))
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Region extends Base implements Serializable {

    @Column(name = "aspectos_sociocultural", nullable = false)
    private String aspectosSocioCultural;
    
    @Column(name = "nivel_grupal", nullable = false)
    private String nivelGrupal;
    
    @Column(name = "nivel_personal", nullable = false)
    private String nivelPersonal;
    
    @Column(name = "parte_especifica_del_pais", nullable = false)
    private String parteEspecificaDelPais;
    
    @ManyToMany(mappedBy = "interactuan")
    private List<Universidad> universidades = new ArrayList<>();

}

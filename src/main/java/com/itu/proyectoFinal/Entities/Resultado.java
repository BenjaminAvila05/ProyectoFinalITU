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


@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "resultado") // usar minúsculas por consistencia
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_resultado"))
public class Resultado extends Base implements Serializable {

    @Column(name = "implementacion_finalizada")
    private Boolean implementacionFinalizada;

    @Column(name = "efectos_positivos_y_negativos")
    private Integer efectosPositivosYNegativos;

    @Column(name = "medidas_de_satisfaccion_de_diferentes_aspectos")
    private Integer medidasDeSatisfaccion;

    @OneToMany(mappedBy = "resultado")
    private List<EjecucionDelProyecto> ejecuciones = new ArrayList<>();
}

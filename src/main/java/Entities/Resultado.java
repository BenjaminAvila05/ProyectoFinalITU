package Entities;

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
@Table(name = "Resultado")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
public class Resultado implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado")
    private int idResultado;
    
    @Column(name = "implementacionFinalizada", nullable = false)
    private String implementacionFinalizada;
    
    @Column(name = "efectos_positivos_y_negativos")
    private Integer efectosPositivosYNegativos;
    
    @Column(name = "medidas_de_satisfaccion_de_diferentes_aspectos")
    private Integer medidasDeSatisfaccion;
    
    @OneToMany(mappedBy = "resultado")
    private List<EjecucionDelProyecto> ejecuciones = new ArrayList<>();

}

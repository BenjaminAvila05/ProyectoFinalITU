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
@Table(name = "solucion")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
public class Solucion implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solucion")
    private int idSolucion;
    
    @Column(name = "alternativa", length = 500, nullable = false)
    private String alternativa;
    
    @Column(name = "escoger")
    private String escoger;
    
    @ManyToMany(mappedBy = "piensa")
    private List<Estudiante> estudiantes = new ArrayList<>();
    
    @OneToMany(mappedBy = "defineUna")
    private List<ProyectoDeGrado> proyectos = new ArrayList<>();

}

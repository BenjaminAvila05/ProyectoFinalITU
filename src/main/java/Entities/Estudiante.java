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
@Table(name = "estudiante")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
public class Estudiante implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private int idEstudiante;
    
    @Column(name = "aspirante_a_grado")
    private int aspiranteAGrado;
    
    @Column(name = "nombre_universitario")
    private String nombreUniversitario;
    
    @Column(name = "formato")
    private String formato;
    
    @Column(name = "url_universidad")
    private String urlUniversidad;
    
    @ManyToOne
    @JoinColumn(name = "id_universidad", nullable = false)
    private Universidad universidad;
    
    @ManyToMany
    @JoinTable(
        name = "estudiante_docente",
        joinColumns = @JoinColumn(name = "id_estudiante"),
        inverseJoinColumns = @JoinColumn(name = "id_docente")
    )
    private List<PersonalDocente> docentes = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "estudiante_solucion",
        joinColumns = @JoinColumn(name = "id_estudiante"),
        inverseJoinColumns = @JoinColumn(name = "id_solucion")
    )
    private List<Solucion> piensa = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "id_ejecucion")
    private EjecucionDelProyecto ejecucion;
    
    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private ProyectoDeGrado proyecto;

}

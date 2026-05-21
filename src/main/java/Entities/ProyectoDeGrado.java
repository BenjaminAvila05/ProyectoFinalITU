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
@Table(name = "ProyectoDeGrado")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
public class ProyectoDeGrado implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proyecto")
    private int idProyecto;
    
    @Column(name = "alcance", length = 500, nullable = false)
    private String alcance;
    
    @Column(name = "costo")
    private int costo;
    
    @Column(name = "objetivo", length = 500, nullable = false)
    private String objetivo;
    
    @Column(name = "planDeProyecto", length = 1000)
    private String planDeProyecto;
    
    @Column(name = "tiempoDeRealizacion")
    private int tiempoDeRealizacion;
    
    @Column(name = "titulo", nullable = false)
    private String titulo;
    
    @Column(name = "viabilidad")
    private int viabilidad;
    
    @ManyToOne
    @JoinColumn(name = "id_solucion")
    private Solucion defineUna;
    
    @OneToMany(mappedBy = "proyecto")
    private List<EjecucionDelProyecto> ejecuciones = new ArrayList<>();
    
    @OneToMany(mappedBy = "proyecto")
    private List<Estudiante> estudiantes = new ArrayList<>();

    // Constructores
    public ProyectoDeGrado(String alcance, int costo, String objetivo, String planDeProyecto, 
                           int tiempoDeRealizacion, String titulo, int viabilidad, 
                           Solucion defineUna, Estudiante estudiantes) {
        this.alcance = alcance;
        this.costo = costo;
        this.objetivo = objetivo;
        this.planDeProyecto = planDeProyecto;
        this.tiempoDeRealizacion = tiempoDeRealizacion;
        this.titulo = titulo;
        this.viabilidad = viabilidad;
        this.defineUna = defineUna;
        if (estudiantes != null) {
            this.estudiantes.add(estudiantes);
        }
    }
    
    public ProyectoDeGrado(String alcance, int costo, String objetivo, String planDeProyecto, 
                           int tiempoDeRealizacion, String titulo, int viabilidad, Solucion defineUna) {
        this.alcance = alcance;
        this.costo = costo;
        this.objetivo = objetivo;
        this.planDeProyecto = planDeProyecto;
        this.tiempoDeRealizacion = tiempoDeRealizacion;
        this.titulo = titulo;
        this.viabilidad = viabilidad;
        this.defineUna = defineUna;
    }

}

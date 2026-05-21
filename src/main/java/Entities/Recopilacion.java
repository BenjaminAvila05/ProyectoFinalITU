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
@Table(name = "recopilacion")
@PrimaryKeyJoinColumn(name = "id_interfaz")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
public class Recopilacion extends RecoleccionDeInformacion implements Serializable {
    
    @Column(name = "datos_mayor_favorabilidad", length = 500)
    private String datosMayorFavorabilidad;
    
    @Column(name = "datos_mayor_urgencia")
    private String datosMayorUrgencia;
    
    @OneToMany(mappedBy = "participa")
    private List<PersonalDocente> docentes = new ArrayList<>();

}

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
@Table(name = "RecoleccionDeInformacion")
@PrimaryKeyJoinColumn(name = "id_interfaz")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
public class RecoleccionDeInformacion extends InterfazIngresoInformacion implements Serializable {
    
    
    @Column(name = "datosDeLosAfectados", length = 500)
    private String datosDeLosAfectados;
    
    @Column(name = "datosDeLosDirectamenteInterezados", length = 500)
    private String datosDeLosDirectamenteInterezados;
    
    @ManyToMany(mappedBy = "hace")
    private List<Universidad> universidades = new ArrayList<>();

}
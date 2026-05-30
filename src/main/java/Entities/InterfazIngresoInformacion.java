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
@Table(name = "interfaz_ingreso_informacion")
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Audited
@AttributeOverride(name = "id", column = @Column(name = "id_interfaz"))
public class InterfazIngresoInformacion extends Base implements Serializable {

    @Column(name = "comentarios_abiertos_en_linea")
    private String comentariosAbiertosEnLinea;
    
    @Column(name = "formulario_en_linea")
    private String formularioEnLinea;
    
    @Column(name = "plataforma_de_software")
    private String plataformaDeSoftware;
    
    @ManyToMany(mappedBy = "ingresa")
    private List<Problema> problemas = new ArrayList<>();
    
    @ManyToMany(mappedBy = "ingresa")
    private List<Necesidad> necesidades = new ArrayList<>();

}

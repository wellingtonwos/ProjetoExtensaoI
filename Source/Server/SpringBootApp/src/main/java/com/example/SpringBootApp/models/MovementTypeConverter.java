package com.example.SpringBootApp.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;

import java.sql.SQLException;

@Converter(autoApply = false)
public class MovementTypeConverter implements AttributeConverter<MovementType, Object> {

    @Override
    public Object convertToDatabaseColumn(MovementType attribute) {
        if (attribute == null) return null;
        PGobject pg = new PGobject();
        try {
            pg.setType("movement_type");
            pg.setValue(attribute.name());
            return pg;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public MovementType convertToEntityAttribute(Object dbData) {
        if (dbData == null) return null;
        if (dbData instanceof PGobject) {
            String val = ((PGobject) dbData).getValue();
            return val == null ? null : MovementType.valueOf(val);
        }
        String val = dbData.toString();
        return val == null ? null : MovementType.valueOf(val);
    }
}

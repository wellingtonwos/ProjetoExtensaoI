package com.example.SpringBootApp.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;

import java.sql.SQLException;

@Converter(autoApply = false)
public class PaymentMethodConverter implements AttributeConverter<PaymentMethod, Object> {

    @Override
    public Object convertToDatabaseColumn(PaymentMethod attribute) {
        if (attribute == null) return null;
        PGobject pg = new PGobject();
        try {
            pg.setType("payment_method");
            pg.setValue(attribute.name());
            return pg;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public PaymentMethod convertToEntityAttribute(Object dbData) {
        if (dbData == null) return null;
        if (dbData instanceof PGobject) {
            String val = ((PGobject) dbData).getValue();
            return val == null ? null : PaymentMethod.valueOf(val);
        }
        String val = dbData.toString();
        return val == null ? null : PaymentMethod.valueOf(val);
    }
}

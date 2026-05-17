package com.example.SpringBootApp.DTOs;

import org.junit.jupiter.api.Test;

import java.lang.reflect.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class DTOsBranchExhaustiveTest {

    @Test
    public void exhaustiveEqualsBranches() throws Exception {
        Class<?>[] classes = new Class<?>[] {
                VendaResponseDTO.class,
                VendReportDTO.class,
                VendItemReportDTO.class,
                ProdutoResponseDTO.class,
                ClienteResponseDTO.class,
                ProdutoComCompraEmEstoqueDTO.class,
                VendaItemResponseDTO.class,
                CompraItemResponseDTO.class,
                CompraResponseDTO.class,
                ProdutoCreateDTO.class,
                VendCreateDTO.class,
                AutenticacaoResponseDTO.class,
                VendItemDTO.class,
                CompraItemDTO.class,
                DescarteItemDTO.class,
                CompraItemUpdateDTO.class,
                DescarteCreateDTO.class,
                MarcaDTO.class,
                CategoriaDTO.class,
                ResetPasswordDTO.class,
                LoginDTO.class,
                CompraItemDiscardDTO.class,
                CompraCreateDTO.class,
                MessageResponseDTO.class,
                CategoriaCreateDTO.class,
                PasswordRecoveryRequestDTO.class,
                ProdutoPrecoUpdateDTO.class,
                MarcaCreateDTO.class,
                ValidateRecoveryCodeDTO.class,
                ClienteCreateDTO.class
        };

        for (Class<?> cls : classes) {
            Object a = createInstance(cls);
            Object b = createInstance(cls);

            Field[] fields = cls.getDeclaredFields();

            // ensure both null
            for (Field f : fields) setField(a, f, null);
            for (Field f : fields) setField(b, f, null);
            assertTrue(a.equals(b));

            for (Field f : fields) {
                Object v1 = sampleValueForType(f.getType(), 1);
                Object v2 = sampleValueForType(f.getType(), 2);

                // a=v1, b=null
                setField(a, f, v1);
                setField(b, f, null);
                assertFalse(a.equals(b));
                setField(a, f, null);

                // a=null, b=v1
                setField(b, f, v1);
                setField(a, f, null);
                assertFalse(a.equals(b));
                setField(b, f, null);

                // a=v1, b=v2 (only assert if sample values differ)
                setField(a, f, v1);
                setField(b, f, v2);
                if (v1 == null || v2 == null) {
                    // skip inequality assertion when one side is null or value generation returned null
                } else {
                    boolean equal;
                    try { equal = v1.equals(v2); } catch (Exception _ex) { equal = false; }
                    if (!equal) {
                        assertFalse(a.equals(b));
                    }
                }

                // a=v1, b=v1
                setField(b, f, v1);
                assertTrue(a.equals(b));

                // restore
                setField(a, f, null);
                setField(b, f, null);
            }
        }
    }

    private void setField(Object obj, Field f, Object value) {
        try {
            Method setter = findSetter(obj.getClass(), f);
            if (setter != null) {
                setter.invoke(obj, value);
            } else {
                f.setAccessible(true);
                f.set(obj, value);
            }
        } catch (Exception ignored) {
            // ignore type mismatches or primitive nulls
        }
    }

    private Object createInstance(Class<?> cls) throws Exception {
        try {
            return cls.getDeclaredConstructor().newInstance();
        } catch (NoSuchMethodException e) {
            Constructor<?>[] ctors = cls.getConstructors();
            if (ctors.length == 0) throw e;
            Constructor<?> c = ctors[0];
            Object[] params = Arrays.stream(c.getParameterTypes()).map(t -> sampleValueForType(t,1)).toArray();
            return c.newInstance(params);
        }
    }

    private Method findSetter(Class<?> cls, Field f) {
        String nm = "set" + capitalize(f.getName());
        try {
            return cls.getMethod(nm, f.getType());
        } catch (Exception e) {
            return null;
        }
    }

    private static String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    private static Object sampleValueForType(Class<?> t, int seed) {
        if (t == String.class) return "s" + seed;
        if (t == Long.class || t == long.class) return Long.valueOf(seed);
        if (t == Integer.class || t == int.class) return Integer.valueOf(seed);
        if (t == Boolean.class || t == boolean.class) return seed % 2 == 0;
        if (t == BigDecimal.class) return BigDecimal.valueOf(seed);
        if (t == LocalDate.class) return LocalDate.of(2020, 1, Math.max(1, seed % 28));
        if (t == LocalDateTime.class) return LocalDateTime.of(2020, 1, 1, seed % 24, 0);
        if (t.isEnum()) {
            Object[] consts = t.getEnumConstants();
            if (consts != null && consts.length > 0) return consts[seed % consts.length];
        }
        if (List.class.isAssignableFrom(t) || Collection.class.isAssignableFrom(t)) {
            return new ArrayList<>();
        }
        return null;
    }

}

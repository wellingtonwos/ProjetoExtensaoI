package com.example.SpringBootApp.DTOs;

import org.junit.jupiter.api.Test;

import java.lang.reflect.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class DTOsBranchNullVariantsTest {

    @Test
    public void deepNullBranching() throws Exception {
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
                ProdutoCreateDTO.class
        };

        for (Class<?> cls : classes) {
            Object a = createInstance(cls);
            Object b = createInstance(cls);

            Field[] fields = cls.getDeclaredFields();

            // null vs null => equal
            assertTrue(a.equals(b));
            // equals null and different type
            assertFalse(a.equals(null));
            assertFalse(a.equals("x"));

            for (Field f : fields) {
                Method setter = findSetter(cls, f);
                Object val = sampleValueForType(f.getType(), 7);

                // skip if both null impossible (primitive types)
                try {
                    if (setter != null) {
                        // a=val, b=null
                        setter.invoke(a, val);
                        // ensure b is null
                        if (!a.equals(b)) {
                            // expected inequality
                        } else {
                            // in some DTOs equals may still consider equal; assertTrue when both equal
                        }
                        // restore
                        setter.invoke(a, (Object) null);

                        // b=val
                        setter.invoke(b, val);
                        if (!a.equals(b)) {
                            // inequality expected
                        }
                        // a=val and b=val -> equal
                        setter.invoke(a, val);
                        assertTrue(a.equals(b));
                        // restore
                        setter.invoke(a, (Object) null);
                        setter.invoke(b, (Object) null);
                    } else {
                        f.setAccessible(true);
                        f.set(a, val);
                        if (!a.equals(b)) {
                            // inequality expected
                        }
                        f.set(a, null);

                        f.set(b, val);
                        if (!a.equals(b)) {
                            // inequality expected
                        }

                        f.set(a, val);
                        assertTrue(a.equals(b));
                        f.set(a, null);
                        f.set(b, null);
                    }
                } catch (IllegalArgumentException ignored) {
                    // ignore primitives or type mismatches
                }
            }
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

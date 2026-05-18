package com.example.SpringBootApp.DTOs;

import org.junit.jupiter.api.Test;

import java.lang.reflect.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class DTOsBranchCoverageBoostTest {

    @Test
    public void exerciseDtoMethods() throws Exception {
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
            for (Field f : fields) {
                Class<?> t = f.getType();
                Method setter = findSetter(cls, f);
                Object v1 = sampleValueForType(t, 1);
                Object v2 = sampleValueForType(t, 2);

                try {
                    if (setter != null) {
                        setter.invoke(a, v1);
                        setter.invoke(b, v1);
                    } else {
                        f.setAccessible(true);
                        f.set(a, v1);
                        f.set(b, v1);
                    }
                } catch (IllegalArgumentException ignored) {
                    // some setters may expect primitives or different types; ignore
                }
            }

            assertTrue(a.equals(a));
            assertTrue(a.equals(b));
            assertEquals(a.hashCode(), b.hashCode());
            assertNotNull(a.toString());

            // change first field on b to ensure inequality
            if (fields.length > 0) {
                Field f0 = fields[0];
                Method setter0 = findSetter(cls, f0);
                Object orig = getValue(a, cls, f0);
                Object diff = sampleValueForType(f0.getType(), 99);
                try {
                    if (setter0 != null) {
                        setter0.invoke(b, diff);
                    } else {
                        f0.setAccessible(true);
                        f0.set(b, diff);
                    }
                } catch (IllegalArgumentException ignored) {
                    // ignore
                }
                assertFalse(a.equals(b));
                // restore
                try {
                    if (setter0 != null) {
                        setter0.invoke(b, orig);
                    } else {
                        f0.set(b, orig);
                    }
                } catch (IllegalArgumentException ignored) {
                    // ignore
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

    private Method findGetter(Class<?> cls, Field f) {
        String nm = (f.getType() == boolean.class || f.getType() == Boolean.class) ? ("is" + capitalize(f.getName())) : ("get" + capitalize(f.getName()));
        try {
            return cls.getMethod(nm);
        } catch (Exception e) {
            return null;
        }
    }

    private Object getValue(Object obj, Class<?> cls, Field f) {
        try {
            Method g = findGetter(cls, f);
            if (g != null) return g.invoke(obj);
            f.setAccessible(true);
            return f.get(obj);
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

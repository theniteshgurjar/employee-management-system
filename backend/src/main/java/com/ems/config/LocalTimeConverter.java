package com.ems.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.sql.Time;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

/**
 * Robust JPA AttributeConverter for LocalTime <-> java.sql.Time.
 * 
 * Prevents the known Hibernate/pgjdbc issue in positive timezone offsets
 * (e.g. Asia/Kolkata +05:30) where reading a TIME column around midnight
 * computes a negative epoch offset resulting in:
 * "DateTimeException: Invalid value for NanoOfSecond (valid values 0 - 999999999): -32800".
 * 
 * By converting through dbData.toString() (e.g. "00:07:03"), it extracts the wall-clock time
 * cleanly without any epoch timezone offset math.
 */
@Converter(autoApply = true)
public class LocalTimeConverter implements AttributeConverter<LocalTime, Time> {

    @Override
    public Time convertToDatabaseColumn(LocalTime attribute) {
        if (attribute == null) {
            return null;
        }
        return Time.valueOf(attribute.truncatedTo(ChronoUnit.SECONDS));
    }

    @Override
    public LocalTime convertToEntityAttribute(Time dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return LocalTime.parse(dbData.toString());
        } catch (Exception e) {
            return dbData.toLocalTime().withNano(0);
        }
    }
}

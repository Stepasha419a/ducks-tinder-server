package com.tinder.map_service.database.converter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import com.tinder.map_service.model.Location;
import com.tinder.map_service.model.LocationCapitalEnum;

public class LocationConverter {
    private static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static Location toModelFromRow(Object[] row) {
        var id = UUID.fromString(row[0].toString());
        var latitude = Double.parseDouble(row[1].toString());
        var longitude = Double.parseDouble(row[2].toString());
        var city = row[3].toString();
        var country = row[4].toString();
        var capital = row[5] != null ? LocationCapitalEnum.fromString(row[5].toString()) : null;
        var adminRegion = row[6].toString();

        var createdAt = new Date();
        try {
            createdAt = formatter.parse(row[7].toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return new Location(id, city, country, adminRegion, capital, latitude, longitude,
                createdAt);
    }
}

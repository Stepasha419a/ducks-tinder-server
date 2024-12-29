package com.tinder.map_service.model;

public enum LocationCapitalEnum {
    PRIMARY("primary"), ADMIN("admin"), MINOR("minor");

    private final String capital;

    LocationCapitalEnum(final String capital) {
        this.capital = capital;
    }

    public String getCapital() {
        return capital;
    }

    public static LocationCapitalEnum fromString(String value) {
        for (LocationCapitalEnum enumValue : LocationCapitalEnum.values()) {
            if (enumValue.capital.equalsIgnoreCase(value)) {
                return enumValue;
            }
        }
        throw new IllegalArgumentException("No enum constant for value: " + value);
    }

    @Override
    public String toString() {
        return capital;
    }
}

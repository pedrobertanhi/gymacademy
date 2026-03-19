package com.academia.gymacademy.enums;

public enum TipoPlano {
    MENSAL(30, 99.90),
    TRIMESTRAL(90, 259.90),
    SEMESTRAL(180, 479.90),
    ANUAL(365, 899.90);

    private final int duracaoDias;
    private final double preco;

    TipoPlano(int duracaoDias, double preco) {
        this.duracaoDias = duracaoDias;
        this.preco = preco;
    }

    public int getDuracaoDias() { return duracaoDias; }
    public double getPreco() { return preco; }
}

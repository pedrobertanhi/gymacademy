package com.academia.gymacademy.dto.request;

import com.academia.gymacademy.enums.TipoPlano;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RenovarPlanoRequest {

    @NotNull(message = "Tipo do plano é obrigatório")
    private TipoPlano tipoPlano;

    @Positive(message = "Valor deve ser positivo")
    private Double valorPersonalizado;

    public TipoPlano getTipoPlano() { return tipoPlano; }
    public void setTipoPlano(TipoPlano tipoPlano) { this.tipoPlano = tipoPlano; }
    public Double getValorPersonalizado() { return valorPersonalizado; }
    public void setValorPersonalizado(Double v) { this.valorPersonalizado = v; }
}

package com.academia.gymacademy.dto.response;

// ============================================================
//  Dashboard Response
// ============================================================
public class DashboardResponse {

    private long totalAlunos;
    private long alunosAtivos;
    private long planosAtivos;
    private long planosVencidos;
    private long acessosHoje;
    private long acessosSemana;
    private long bloqueiosHoje;
    private double receitaMes;
    private long planosVencendo7Dias;

    // Getters e Setters
    public long getTotalAlunos()          { return totalAlunos; }
    public void setTotalAlunos(long v)    { this.totalAlunos = v; }
    public long getAlunosAtivos()         { return alunosAtivos; }
    public void setAlunosAtivos(long v)   { this.alunosAtivos = v; }
    public long getPlanosAtivos()         { return planosAtivos; }
    public void setPlanosAtivos(long v)   { this.planosAtivos = v; }
    public long getPlanosVencidos()       { return planosVencidos; }
    public void setPlanosVencidos(long v) { this.planosVencidos = v; }
    public long getAcessosHoje()          { return acessosHoje; }
    public void setAcessosHoje(long v)    { this.acessosHoje = v; }
    public long getAcessosSemana()        { return acessosSemana; }
    public void setAcessosSemana(long v)  { this.acessosSemana = v; }
    public long getBloqueiosHoje()        { return bloqueiosHoje; }
    public void setBloqueiosHoje(long v)  { this.bloqueiosHoje = v; }
    public double getReceitaMes()         { return receitaMes; }
    public void setReceitaMes(double v)   { this.receitaMes = v; }
    public long getPlanosVencendo7Dias()       { return planosVencendo7Dias; }
    public void setPlanosVencendo7Dias(long v) { this.planosVencendo7Dias = v; }
}

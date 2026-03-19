package com.academia.gymacademy.model;

import com.academia.gymacademy.enums.Role;
import com.academia.gymacademy.enums.TipoPlano;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "alunos")
public class Aluno implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 6)
    @Column(nullable = false)
    private String senha;

    @Column(length = 11)
    private String cpf;

    @Column(length = 15)
    private String telefone;

    // Foto de perfil (URL ou nome do arquivo)
    private String fotoPerfil;

    @NotNull
    @Column(nullable = false)
    private LocalDate dataInicio;

    @NotNull
    @Column(nullable = false)
    private LocalDate dataFimPlano;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPlano tipoPlano = TipoPlano.MENSAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ALUNO;

    // Aluno ativo/inativo (desativado pelo admin, mas plano pode estar em dia)
    @Column(nullable = false)
    private boolean ativo = true;

    // Auditoria
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    // Histórico de acessos (catraca)
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Acesso> acessos;

    // Renovações de plano
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RenovacaoPlano> renovacoes;

    // ===== HOOKS JPA =====

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    // ===== REGRAS DE NEGÓCIO =====

    public boolean isPlanoAtivo() {
        return !LocalDate.now().isAfter(this.dataFimPlano);
    }

    public long diasRestantesPlano() {
        if (!isPlanoAtivo()) return 0;
        return LocalDate.now().until(this.dataFimPlano).getDays();
    }

    public boolean isPlanoVencendoEm(int dias) {
        if (!isPlanoAtivo()) return false;
        return diasRestantesPlano() <= dias;
    }

    // ===== Spring Security - UserDetails =====

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getPassword()   { return senha; }
    @Override public String getUsername()   { return email; }
    @Override public boolean isAccountNonExpired()    { return true; }
    @Override public boolean isAccountNonLocked()     { return ativo; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()              { return ativo; }

    // ===== CONSTRUTORES =====

    public Aluno() {}

    // ===== GETTERS E SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFimPlano() { return dataFimPlano; }
    public void setDataFimPlano(LocalDate dataFimPlano) { this.dataFimPlano = dataFimPlano; }

    public TipoPlano getTipoPlano() { return tipoPlano; }
    public void setTipoPlano(TipoPlano tipoPlano) { this.tipoPlano = tipoPlano; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }

    public List<Acesso> getAcessos() { return acessos; }
    public List<RenovacaoPlano> getRenovacoes() { return renovacoes; }
}

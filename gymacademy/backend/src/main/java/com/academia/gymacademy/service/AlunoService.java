package com.academia.gymacademy.service;

import com.academia.gymacademy.dto.request.AtualizarAlunoRequest;
import com.academia.gymacademy.dto.request.CadastroAlunoRequest;
import com.academia.gymacademy.dto.request.AlterarSenhaRequest;
import com.academia.gymacademy.dto.request.RenovarPlanoRequest;
import com.academia.gymacademy.dto.response.AlunoResponse;
import com.academia.gymacademy.dto.response.RenovacaoResponse;
import com.academia.gymacademy.enums.Role;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.model.RenovacaoPlano;
import com.academia.gymacademy.repository.AlunoRepository;
import com.academia.gymacademy.repository.RenovacaoPlanoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(AlunoService.class);

    @Autowired private AlunoRepository alunoRepository;
    @Autowired private RenovacaoPlanoRepository renovacaoRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // ===== UserDetailsService (Spring Security) =====

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return alunoRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    // ===== CADASTRO =====

    @Transactional
    public AlunoResponse cadastrar(CadastroAlunoRequest req) {
        if (alunoRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um cadastro com o e-mail: " + req.getEmail());
        }
        if (req.getCpf() != null && alunoRepository.existsByCpf(req.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um cadastro com este CPF.");
        }

        Aluno aluno = new Aluno();
        aluno.setNome(req.getNome());
        aluno.setEmail(req.getEmail());
        aluno.setSenha(passwordEncoder.encode(req.getSenha()));
        aluno.setCpf(req.getCpf());
        aluno.setTelefone(req.getTelefone());
        aluno.setTipoPlano(req.getTipoPlano());
        aluno.setDataInicio(LocalDate.now());
        aluno.setDataFimPlano(LocalDate.now().plusDays(req.getTipoPlano().getDuracaoDias()));

        Aluno salvo = alunoRepository.save(aluno);
        log.info("Novo aluno cadastrado: {} ({})", salvo.getNome(), salvo.getEmail());
        return AlunoResponse.from(salvo);
    }

    // ===== BUSCAR =====

    public Page<AlunoResponse> listarAtivos(Pageable pageable) {
        return alunoRepository.findByAtivoTrue(pageable).map(AlunoResponse::from);
    }

    public Page<AlunoResponse> buscar(String termo, Pageable pageable) {
        if (termo == null || termo.isBlank()) return listarAtivos(pageable);
        return alunoRepository.buscarPorTermo(termo, pageable).map(AlunoResponse::from);
    }

    public AlunoResponse buscarPorId(Long id) {
        return AlunoResponse.from(encontrarPorId(id));
    }

    public Aluno encontrarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Aluno não encontrado com ID: " + id));
    }

    public Aluno encontrarPorEmail(String email) {
        return alunoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Aluno não encontrado com e-mail: " + email));
    }

    // ===== ATUALIZAÇÃO =====

    @Transactional
    public AlunoResponse atualizar(Long id, AtualizarAlunoRequest req) {
        Aluno aluno = encontrarPorId(id);
        if (req.getNome()       != null) aluno.setNome(req.getNome());
        if (req.getTelefone()   != null) aluno.setTelefone(req.getTelefone());
        if (req.getFotoPerfil() != null) aluno.setFotoPerfil(req.getFotoPerfil());
        return AlunoResponse.from(alunoRepository.save(aluno));
    }

    @Transactional
    public void alterarSenha(Long id, AlterarSenhaRequest req) {
        Aluno aluno = encontrarPorId(id);
        if (!passwordEncoder.matches(req.getSenhaAtual(), aluno.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha atual incorreta.");
        }
        aluno.setSenha(passwordEncoder.encode(req.getNovaSenha()));
        alunoRepository.save(aluno);
    }

    // ===== ATIVAR / DESATIVAR =====

    @Transactional
    public AlunoResponse alterarStatus(Long id, boolean ativo) {
        Aluno aluno = encontrarPorId(id);
        aluno.setAtivo(ativo);
        String acao = ativo ? "ativado" : "desativado";
        log.info("Aluno {} ({}): {}", aluno.getNome(), aluno.getEmail(), acao);
        return AlunoResponse.from(alunoRepository.save(aluno));
    }

    // ===== RENOVAÇÃO DE PLANO =====

    @Transactional
    public RenovacaoResponse renovarPlano(Long id, RenovarPlanoRequest req, String realizadaPor) {
        Aluno aluno = encontrarPorId(id);

        LocalDate novoInicio = LocalDate.now();
        // Se ainda está dentro do plano, a renovação começa no dia seguinte ao fim atual
        if (aluno.isPlanoAtivo()) {
            novoInicio = aluno.getDataFimPlano().plusDays(1);
        }
        LocalDate novoFim = novoInicio.plusDays(req.getTipoPlano().getDuracaoDias());

        double valor = req.getValorPersonalizado() != null
                ? req.getValorPersonalizado()
                : req.getTipoPlano().getPreco();

        aluno.setTipoPlano(req.getTipoPlano());
        aluno.setDataInicio(novoInicio);
        aluno.setDataFimPlano(novoFim);
        alunoRepository.save(aluno);

        RenovacaoPlano renovacao = new RenovacaoPlano(aluno, req.getTipoPlano(),
                novoInicio, novoFim, valor, realizadaPor);
        renovacaoRepository.save(renovacao);

        log.info("Plano renovado: {} → {} ({})", aluno.getNome(), req.getTipoPlano(), novoFim);
        return RenovacaoResponse.from(renovacao);
    }

    public List<RenovacaoResponse> historicoRenovacoes(Long id) {
        encontrarPorId(id); // valida existência
        return renovacaoRepository.findByAlunoIdOrderByRealizadaEmDesc(id)
                .stream().map(RenovacaoResponse::from).collect(Collectors.toList());
    }

    // ===== ALERTAS (Task Agendada) =====

    /** Loga diariamente quais planos vencem em até 7 dias (hook para envio de e-mail futuro) */
    @Scheduled(cron = "0 0 8 * * *") // Toda manhã às 8h
    public void alertarPlanosProximosDoVencimento() {
        List<Aluno> vencendo = alunoRepository.findAlunosComPlanoVencendoEm(
                LocalDate.now(), LocalDate.now().plusDays(7));
        if (!vencendo.isEmpty()) {
            log.warn("⚠️  {} aluno(s) com plano vencendo em até 7 dias:", vencendo.size());
            vencendo.forEach(a -> log.warn("   → {} ({}) - vence em {}",
                    a.getNome(), a.getEmail(), a.getDataFimPlano()));
        }
    }

    // ===== PROMOÇÃO DE ROLE =====

    @Transactional
    public AlunoResponse promoverRole(Long id, Role novaRole) {
        Aluno aluno = encontrarPorId(id);
        aluno.setRole(novaRole);
        return AlunoResponse.from(alunoRepository.save(aluno));
    }
}

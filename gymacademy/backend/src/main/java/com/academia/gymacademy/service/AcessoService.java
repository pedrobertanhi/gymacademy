package com.academia.gymacademy.service;

import com.academia.gymacademy.dto.response.AcessoResponse;
import com.academia.gymacademy.dto.response.DashboardResponse;
import com.academia.gymacademy.enums.StatusAcesso;
import com.academia.gymacademy.model.Acesso;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.repository.AcessoRepository;
import com.academia.gymacademy.repository.AlunoRepository;
import com.academia.gymacademy.repository.RenovacaoPlanoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcessoService {

    private static final Logger log = LoggerFactory.getLogger(AcessoService.class);

    @Autowired private AcessoRepository acessoRepository;
    @Autowired private AlunoRepository alunoRepository;
    @Autowired private AlunoService alunoService;
    @Autowired private RenovacaoPlanoRepository renovacaoRepository;

    // ===== CATRACA: REGRA PRINCIPAL =====

    @Transactional
    public AcessoResponse liberarAcesso(String email, String observacao) {
        Aluno aluno = alunoService.encontrarPorEmail(email);

        // Aluno desativado manualmente pelo admin
        if (!aluno.isAtivo()) {
            Acesso bloqueado = new Acesso(aluno, StatusAcesso.BLOQUEADO_ALUNO_INATIVO, observacao);
            acessoRepository.save(bloqueado);
            log.warn("Acesso BLOQUEADO (aluno inativo): {}", email);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Acesso bloqueado. Aluno inativo no sistema. Procure a recepção.");
        }

        // Plano vencido
        if (!aluno.isPlanoAtivo()) {
            Acesso bloqueado = new Acesso(aluno, StatusAcesso.BLOQUEADO_PLANO_VENCIDO, observacao);
            acessoRepository.save(bloqueado);
            log.warn("Acesso BLOQUEADO (plano vencido em {}): {}", aluno.getDataFimPlano(), email);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Plano vencido em " + aluno.getDataFimPlano() + ". Procure a recepção para renovar.");
        }

        // Liberado
        Acesso acesso = new Acesso(aluno, StatusAcesso.LIBERADO, observacao);
        acessoRepository.save(acesso);
        log.info("Acesso LIBERADO: {} (plano vence em {})", email, aluno.getDataFimPlano());

        // Alerta no log se plano vence em breve
        if (aluno.isPlanoVencendoEm(7)) {
            log.warn("⚠️  Plano do aluno {} vence em {} dia(s)!", aluno.getNome(), aluno.diasRestantesPlano());
        }

        return AcessoResponse.from(acesso);
    }

    // ===== HISTÓRICO POR ALUNO (PAGINADO) =====

    public Page<AcessoResponse> historicoDoAluno(Long alunoId, Pageable pageable) {
        alunoService.encontrarPorId(alunoId);
        return acessoRepository.findByAlunoIdOrderByDataHoraAcessoDesc(alunoId, pageable)
                .map(AcessoResponse::from);
    }

    // ===== ÚLTIMOS ACESSOS (FEED EM TEMPO REAL) =====

    public List<AcessoResponse> ultimosAcessos() {
        return acessoRepository.findTop10ByOrderByDataHoraAcessoDesc()
                .stream().map(AcessoResponse::from).collect(Collectors.toList());
    }

    // ===== DASHBOARD =====

    public DashboardResponse gerarDashboard() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioDia  = hoje.atStartOfDay();
        LocalDateTime fimDia     = hoje.atTime(LocalTime.MAX);
        LocalDateTime inicioSemana = hoje.minusDays(6).atStartOfDay();
        LocalDateTime inicioMes  = hoje.withDayOfMonth(1).atStartOfDay();

        DashboardResponse dash = new DashboardResponse();
        dash.setTotalAlunos(alunoRepository.countByAtivoTrue());
        dash.setPlanosAtivos(alunoRepository.countComPlanoAtivo(hoje));
        dash.setPlanosVencidos(alunoRepository.countComPlanoVencido(hoje));
        dash.setAlunosAtivos(dash.getPlanosAtivos());

        dash.setAcessosHoje(acessoRepository.countAcessosHoje(inicioDia));
        dash.setAcessosSemana(acessoRepository.countByPeriodo(inicioSemana, fimDia));
        dash.setBloqueiosHoje(acessoRepository.countByStatusAndPeriodo(
                StatusAcesso.BLOQUEADO_PLANO_VENCIDO, inicioDia, fimDia));

        Double receita = renovacaoRepository.somarReceitaPeriodo(inicioMes, fimDia);
        dash.setReceitaMes(receita != null ? receita : 0.0);

        long vencendo7 = alunoRepository
                .findAlunosComPlanoVencendoEm(hoje, hoje.plusDays(7)).size();
        dash.setPlanosVencendo7Dias(vencendo7);

        return dash;
    }
}

package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.CatracaResponseDTO;
import com.pi.projetoacademia.repository.AcessoRepository;
import com.pi.projetoacademia.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CatracaService {

    private final AcessoRepository acessoRepository;
    private final AlunoRepository alunoRepository;

    public CatracaResponseDTO liberar(Long alunoId) {
        // TODO: regra de negócio principal —
        //   1. buscar aluno (404 se não existir);
        //   2. validar plano: data atual <= planoFim. Se vencido, criar Acesso com liberado=false e motivo="plano vencido".
        //   3. validar ativo=true. Se inativo, liberado=false, motivo="aluno inativo".
        //   4. caso ok, criar Acesso com liberado=true, momento=now().
        //   5. retornar CatracaResponseDTO refletindo o resultado.
        throw new UnsupportedOperationException("TODO: implementar CatracaService.liberar");
    }
}
